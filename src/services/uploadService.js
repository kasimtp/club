// Secure Media Upload Service
// Order of preference:
//   1. ImageKit (VITE_IMAGEKIT_PUBLIC_KEY + VITE_IMAGEKIT_URL_ENDPOINT, signed by /api/imagekit-auth)
//   2. A custom upload server (VITE_UPLOAD_API_URL)
//   3. Local development only: inline data URL stored in the record (small files)
// Validates file types and sizes, avoids exposed client-side private signing keys,
// and supports direct cloud upload or compressed local data URLs for preview and persistence.

import { isImageKitConfigured, uploadToImageKit } from './imagekitService';

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const MAX_IMAGE_SIZE_MB = 10;
export const MAX_VIDEO_SIZE_MB = 40;
export const MAX_INLINE_SIZE_MB = 0.7;

const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|bmp|svg|jfif|heic|heif|avif)$/i;
const VIDEO_EXTENSIONS = /\.(mp4|webm|mov|m4v|ogg)$/i;

/**
 * Validates a file's MIME type and size limit
 */
export function validateMediaFile(file, expectedType = 'image') {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const hasImageMime = file.type && file.type.startsWith('image/');
  const hasVideoMime = file.type && file.type.startsWith('video/');
  const hasImageExt = IMAGE_EXTENSIONS.test(file.name || '');
  const hasVideoExt = VIDEO_EXTENSIONS.test(file.name || '');

  const isImage = hasImageMime || hasImageExt;
  const isVideo = hasVideoMime || hasVideoExt;

  if (expectedType === 'image' && !isImage) {
    throw new Error('Please select a valid image file (JPEG, PNG, WebP).');
  }

  if (expectedType === 'video' && !isVideo) {
    throw new Error('Please select a valid MP4 or WebM video file.');
  }

  const maxBytes = (expectedType === 'video' ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB) * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error(`File exceeds maximum allowed size of ${expectedType === 'video' ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB}MB.`);
  }

  return true;
}

const MAX_IMAGE_EDGE = 1600;       // px — plenty for hero / gallery displays
const MAX_AVATAR_EDGE = 600;        // px — crisp ID / passport photo, tiny file size
const COMPRESS_ABOVE_BYTES = 100 * 1024;

/**
 * Shrinks large photos in the browser before upload.
 * Member avatars are clamped to max 600px (~25-50 KB), preserving memory and storage quotas.
 */
export async function compressImage(file, maxEdge = MAX_IMAGE_EDGE) {
  const type = (file.type || '').toLowerCase();
  const name = file.name || 'photo.jpg';
  if (/gif|svg/.test(type) || /\.(gif|svg)$/i.test(name)) return file;

  // 1. Modern fast path: createImageBitmap + canvas
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
      if (bitmap && bitmap.width > 0 && bitmap.height > 0) {
        const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
        if (scale < 1 || file.size > COMPRESS_ABOVE_BYTES) {
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(bitmap.width * scale));
          canvas.height = Math.max(1, Math.round(bitmap.height * scale));
          const ctx = canvas.getContext('2d');
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          bitmap.close?.();

          const blob = await new Promise((resolve) => {
            let done = false;
            const finish = (b) => { if (!done) { done = true; resolve(b); } };
            try {
              canvas.toBlob(finish, 'image/webp', 0.85);
            } catch {
              finish(null);
            }
            setTimeout(() => finish(null), 2500);
          });

          if (blob && blob.size > 0 && blob.size < file.size) {
            const outName = name.replace(/\.[^.]+$/, '') + '.webp';
            return new File([blob], outName, { type: 'image/webp', lastModified: Date.now() });
          }
        } else {
          bitmap.close?.();
          return file;
        }
      }
    } catch {
      // Fall through to FileReader fallback
    }
  }

  // 2. Rock-solid fallback: FileReader + HTMLImageElement + canvas.toDataURL
  try {
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read image.'));
      reader.readAsDataURL(file);
    });

    const img = await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Failed to load image.'));
      image.src = dataUrl;
    });

    const scale = Math.min(1, maxEdge / Math.max(img.width || 1, img.height || 1));
    if (scale < 1 || file.size > COMPRESS_ABOVE_BYTES) {
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const outDataUrl = canvas.toDataURL('image/jpeg', 0.82);

      const res = await fetch(outDataUrl);
      const blob = await res.blob();
      const outName = name.replace(/\.[^.]+$/, '') + '.jpg';
      return new File([blob], outName, { type: 'image/jpeg', lastModified: Date.now() });
    }
    return file;
  } catch {
    return file; // If compression fails, return the original file
  }
}

/**
 * Reads a file into a high-quality Data URL (Base64)
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Securely uploads an image or video asset
 * If an external backend endpoint or ImageKit is available, uploads via cloud API.
 * Otherwise returns an optimized base64 asset.
 */
export async function uploadMedia(file, folder = 'general', expectedType = 'image', { onProgress } = {}) {
  validateMediaFile(file, expectedType);

  // Photos are compressed first with appropriate bounds per target
  if (expectedType === 'image') {
    const isAvatar = folder === 'members' || folder === 'users' || folder === 'profile';
    file = await compressImage(file, isAvatar ? MAX_AVATAR_EDGE : MAX_IMAGE_EDGE);
  }

  // 1. ImageKit media storage (shared with the mobile app)
  if (isImageKitConfigured) {
    try {
      const uploaded = await uploadToImageKit(file, folder, { onProgress });
      return uploaded.url;
    } catch (err) {
      console.warn('ImageKit cloud upload failed, falling back to local storage:', err.message);
    }
  }

  // 2. Custom backend upload endpoint if provided in env
  const uploadApiUrl = import.meta.env.VITE_UPLOAD_API_URL;
  if (uploadApiUrl) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch(uploadApiUrl, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const url = data.url || data.mediaUrl || data.secure_url;
        if (url) return url;
      }
    } catch (err) {
      console.warn('Custom upload API failed, falling back to local storage:', err.message);
    }
  }

  // 3. Fallback: Compact Data URL
  if (expectedType === 'video' && file.size > MAX_INLINE_SIZE_MB * 1024 * 1024) {
    throw new Error(
      `This video is ${(file.size / 1024 / 1024).toFixed(1)}MB. Without ImageKit configured ` +
      `only videos under ${MAX_INLINE_SIZE_MB * 1000}KB can be saved. Host it elsewhere and paste the URL instead.`
    );
  }

  return await readFileAsDataUrl(file);
}

/**
 * Reads an image or video's intrinsic size from a local file or a URL.
 * Resolves to width / height (e.g. 0.5625 for a 9:16 reel), or null if it can't be read.
 */
export function measureMedia(source, kind = 'image') {
  return new Promise((resolve) => {
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    const done = (w, h) => {
      if (typeof source !== 'string') URL.revokeObjectURL(url);
      resolve(w && h ? Number((w / h).toFixed(4)) : null);
    };

    if (kind === 'video') {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.muted = true;
      v.onloadedmetadata = () => done(v.videoWidth, v.videoHeight);
      v.onerror = () => done(0, 0);
      v.src = url;
    } else {
      const img = new Image();
      img.onload = () => done(img.naturalWidth, img.naturalHeight);
      img.onerror = () => done(0, 0);
      img.src = url;
    }
  });
}

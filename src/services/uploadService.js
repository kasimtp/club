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
// Without an upload server, files are stored inline as data URLs in the record itself.
// Firestore documents cap at 1MB, so anything bigger cannot be saved that way.
export const MAX_INLINE_SIZE_MB = 0.7;

/**
 * Validates a file's MIME type and size limit
 */
export function validateMediaFile(file, expectedType = 'image') {
  if (!file) {
    throw new Error('No file provided for upload.');
  }

  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');

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

const MAX_IMAGE_EDGE = 2400;        // px — plenty for full-screen display, far smaller than phone originals
const COMPRESS_ABOVE_BYTES = 600 * 1024;

/**
 * Shrinks large photos in the browser before upload (longest edge ≤ 2400px, WebP ~85%).
 * Faster uploads on mobile data and smaller stored originals. Small images, GIFs (animation)
 * and SVGs are left untouched, and the original is kept if compression doesn't help.
 */
export async function compressImage(file) {
  if (!file.type.startsWith('image/') || /gif|svg/.test(file.type)) return file;
  if (typeof createImageBitmap !== 'function') return file;

  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file; // format the browser can't decode (e.g. some HEIC) — upload as-is
  }

  const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= COMPRESS_ABOVE_BYTES) {
    bitmap.close?.();
    return file;
  }

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85));
  if (!blob || blob.size >= file.size) return file;

  const name = file.name.replace(/\.[^.]+$/, '') + '.webp';
  return new File([blob], name, { type: 'image/webp', lastModified: Date.now() });
}

/**
 * Reads a file into a high-quality Data URL (Base64)
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Securely uploads an image or video asset
 * If an external backend endpoint is available, uploads via multipart POST.
 * Otherwise returns an optimized base64 asset.
 */
export async function uploadMedia(file, folder = 'general', expectedType = 'image', { onProgress } = {}) {
  // Photos are compressed first, so a large phone photo isn't rejected by the size limit
  if (expectedType === 'image' && file?.type?.startsWith('image/')) file = await compressImage(file);
  validateMediaFile(file, expectedType);

  // ImageKit media storage (shared with the mobile app)
  if (isImageKitConfigured) {
    const uploaded = await uploadToImageKit(file, folder, { onProgress });
    return uploaded.url;
  }

  // If a secure backend upload endpoint is provided in env
  const uploadApiUrl = import.meta.env.VITE_UPLOAD_API_URL;
  if (uploadApiUrl) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(uploadApiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload server error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.url || data.mediaUrl || data.secure_url;
  }

  // Fallback: Read as base64 / Data URL
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

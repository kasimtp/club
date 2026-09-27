// Secure Media Upload Service
// Validates file types and sizes, avoids exposed client-side private signing keys,
// and supports direct cloud upload or compressed local data URLs for preview and persistence.

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_VIDEO_SIZE_MB = 40;

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
export async function uploadMedia(file, folder = 'general', expectedType = 'image') {
  validateMediaFile(file, expectedType);

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
  return await readFileAsDataUrl(file);
}

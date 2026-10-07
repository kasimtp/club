// ImageKit media storage (images + videos)
// Uploads go straight from the browser to ImageKit using a short-lived signature from
// /api/imagekit-auth, so the private key stays on the server.
// Files land in the same folders the mobile app uses: slides, gallery, programs, members.

const UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload';
const AUTH_ENDPOINT = import.meta.env.VITE_IMAGEKIT_AUTH_ENDPOINT || '/api/imagekit-auth';

export const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || '';
export const IMAGEKIT_URL_ENDPOINT = (import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || '').replace(/\/$/, '');

export const isImageKitConfigured = Boolean(IMAGEKIT_PUBLIC_KEY && IMAGEKIT_URL_ENDPOINT);

export const IMAGEKIT_FOLDERS = ['slides', 'gallery', 'programs', 'members'];

async function getUploadSignature() {
  const res = await fetch(AUTH_ENDPOINT, { cache: 'no-store' });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(body.error || `Could not authorise the upload (${res.status}).`);
  }
  return body; // { token, expire, signature }
}

const safeFileName = (name = 'upload') =>
  name.normalize('NFKD').replace(/[^\w.-]+/g, '-').replace(/-+/g, '-').slice(-80) || 'upload';

/**
 * Uploads a File to ImageKit.
 * @param {File} file
 * @param {string} folder one of IMAGEKIT_FOLDERS
 * @param {{ onProgress?: (percent: number) => void }} options
 * @returns {Promise<{ url: string, fileId: string, width?: number, height?: number, thumbnailUrl?: string, fileType: string }>}
 */
export async function uploadToImageKit(file, folder = 'general', { onProgress } = {}) {
  if (!isImageKitConfigured) {
    throw new Error('ImageKit is not configured (VITE_IMAGEKIT_PUBLIC_KEY / VITE_IMAGEKIT_URL_ENDPOINT).');
  }

  const { token, expire, signature } = await getUploadSignature();

  const form = new FormData();
  form.append('file', file);
  form.append('fileName', safeFileName(file.name));
  form.append('folder', `/${folder}`);
  form.append('useUniqueFileName', 'true');
  form.append('publicKey', IMAGEKIT_PUBLIC_KEY);
  form.append('signature', signature);
  form.append('expire', String(expire));
  form.append('token', token);

  // XMLHttpRequest instead of fetch so large videos can report upload progress
  const result = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', UPLOAD_URL);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let body = {};
      try { body = JSON.parse(xhr.responseText); } catch { /* non-JSON error page */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(body);
      else reject(new Error(body.message || `ImageKit upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error('Network error while uploading to ImageKit.'));
    xhr.send(form);
  });

  return {
    url: result.url,
    fileId: result.fileId,
    width: result.width,
    height: result.height,
    thumbnailUrl: result.thumbnailUrl,
    fileType: result.fileType,
  };
}

const isImageKitUrl = (url) => Boolean(url && IMAGEKIT_URL_ENDPOINT && url.startsWith(IMAGEKIT_URL_ENDPOINT));
const withTr = (url, tr) => `${url}${url.includes('?') ? '&' : '?'}tr=${tr}`;

/**
 * Builds a resized / optimised delivery URL for an ImageKit image.
 * f-auto serves WebP/AVIF to browsers that support it. Non-ImageKit URLs are returned unchanged.
 */
export function ikUrl(url, { width, height, quality = 80 } = {}) {
  if (!isImageKitUrl(url)) return url;
  // c-at_max: shrink to fit but never enlarge beyond the original
  const tr = [width && `w-${width}`, height && `h-${height}`, (width || height) && 'c-at_max', `q-${quality}`, 'f-auto']
    .filter(Boolean).join(',');
  return withTr(url, tr);
}

/**
 * Compressed, resized delivery URL for an ImageKit video.
 * ImageKit transcodes on first request and caches the result on its CDN, so every later
 * visitor gets the small file. f-auto picks WebM/MP4 per browser.
 */
export function ikVideoUrl(url, { width, quality = 60 } = {}) {
  if (!isImageKitUrl(url)) return url;
  const tr = [width && `w-${width}`, `q-${quality}`, 'f-auto'].filter(Boolean).join(',');
  return withTr(url, tr);
}

/**
 * ImageKit generates a poster frame for uploaded videos at <url>/ik-thumbnail.jpg.
 * f-auto is ignored for these thumbnails (they come back as large PNGs), so ask for WebP
 * explicitly: ~16 KB instead of ~570 KB for a 720px frame.
 */
export function videoPosterUrl(url, { width = 960 } = {}) {
  if (!isImageKitUrl(url)) return '';
  return withTr(`${url.split('?')[0]}/ik-thumbnail.jpg`, `w-${width},q-75,f-webp`);
}

/** Pixel width to request for media shown `cssWidth` px wide (sharp on retina, never huge) */
export function targetWidth(cssWidth, max = 1600) {
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  // Round up to steps of 160px so nearby screen sizes share one cached file on the CDN
  return Math.min(max, Math.ceil((cssWidth * dpr) / 160) * 160);
}

/** True on Data Saver or very slow connections — show a poster instead of autoplaying video */
export function prefersLightMedia() {
  const c = typeof navigator !== 'undefined' ? navigator.connection : null;
  return Boolean(c && (c.saveData || ['slow-2g', '2g'].includes(c.effectiveType)));
}

// ImageKit upload signing endpoint (Vercel serverless function: GET /api/imagekit-auth)
//
// The browser uploads files straight to ImageKit, but every upload needs a short-lived
// signature made with the PRIVATE key. That key lives only here, on the server, in the
// IMAGEKIT_PRIVATE_KEY environment variable — it is never shipped to the browser.
//
// The same handler is mounted on the Vite dev server (see vite.config.js) for `npm run dev`.

import crypto from 'node:crypto';

const SIGNATURE_TTL_SECONDS = 10 * 60; // ImageKit rejects expiries more than 1 hour ahead

export function signUpload(privateKey) {
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + SIGNATURE_TTL_SECONDS;
  const signature = crypto.createHmac('sha1', privateKey).update(token + expire).digest('hex');
  return { token, expire, signature };
}

function originOf(url) {
  try {
    return url ? new URL(url).origin : '';
  } catch {
    return '';
  }
}

function isAllowedOrigin(origin, allowedList) {
  if (!allowedList) return true; // no allow-list configured
  if (!origin) return false;
  return allowedList
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean)
    .includes(origin);
}

export default function handler(req, res, env = process.env) {
  const privateKey = env.IMAGEKIT_PRIVATE_KEY;
  const origin = req.headers.origin || originOf(req.headers.referer);

  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  if (!privateKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'IMAGEKIT_PRIVATE_KEY is not set on the server.' }));
    return;
  }

  if (!isAllowedOrigin(origin, env.ALLOWED_ORIGINS)) {
    res.statusCode = 403;
    res.end(JSON.stringify({ error: 'Origin not allowed to upload.' }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify(signUpload(privateKey)));
}

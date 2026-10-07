import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import imagekitAuth from './api/imagekit-auth.js'

// Serves /api/imagekit-auth during `npm run dev`, mirroring the Vercel function in /api.
// Server-only variables (IMAGEKIT_PRIVATE_KEY, ALLOWED_ORIGINS) are read from .env here
// and are never exposed to the browser bundle (only VITE_* variables are).
function imagekitAuthDevServer(env) {
  return {
    name: 'imagekit-auth-dev',
    configureServer(server) {
      server.middlewares.use('/api/imagekit-auth', (req, res) => imagekitAuth(req, res, env))
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      imagekitAuthDevServer(env),
    ],
  }
})

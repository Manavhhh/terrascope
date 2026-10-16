import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import cesiumPlugin from 'vite-plugin-cesium'

// vite-plugin-cesium export compatibility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cesium = (typeof cesiumPlugin === 'function' ? cesiumPlugin : (cesiumPlugin as any).default) as () => any

export default defineConfig({
  plugins: [react(), tailwindcss(), cesium()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})

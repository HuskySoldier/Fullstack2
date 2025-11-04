import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda'),
  build: {
    outDir: resolve(__dirname, 'dist'),
  },
})

// vite.config.ts (Corregido)
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  // ✅ Apunta a la carpeta 'tienda' que contiene tu index.html
  root: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda'), 
  build: {
    // La salida del build ahora estará en 'dist', 
    // relativo al proyecto, no a la carpeta 'tienda'
    outDir: resolve(__dirname, 'dist'),
    rollupOptions: {
      // Asegúrate de que Vite sepa de tus otras páginas HTML
      input: {
        main: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda/index.html'),
        productos: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda/pages/productos.html'),
        login: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda/pages/login.html'),
        registro: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda/pages/registro.html'),
        carrito: resolve(__dirname, 'Fullstack2/Fullstack2-main/tienda/pages/carrito.html'),
        // ... añade aquí el resto de tus archivos HTML en 'pages'
      }
    }
  },
  // Necesario para que Vite pueda encontrar 'src'
  // cuando el root está en 'tienda'
  server: { 
    fs: {
      allow: ['..'] 
    }
  }
})
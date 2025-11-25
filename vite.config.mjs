import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// Configuración de Vite con el plugin oficial de Tailwind v4.1
export default defineConfig({
  plugins: [tailwindcss()],
})


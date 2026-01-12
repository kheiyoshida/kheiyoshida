import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), EnvironmentPlugin(['DEBUG'])],
  resolve: {
    alias: {
      src: '/src',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 3000
  },
})

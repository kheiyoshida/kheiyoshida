import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: fs.readFileSync('./host/localhost+3-key.pem'),
      cert: fs.readFileSync('./host/localhost+3.pem')
    }
  },
})

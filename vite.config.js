import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ["zaiwu.org", "www.zaiwu.org"],
  },
  preview: {
    allowedHosts: ["zaiwu.org", "www.zaiwu.org"],
  },
})

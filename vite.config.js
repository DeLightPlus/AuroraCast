
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['e98d3c2e-4b06-4964-91d5-5a348bdbf0f3-00-t1jyi83n85nc.picard.replit.dev', '.replit.dev']
  }
})

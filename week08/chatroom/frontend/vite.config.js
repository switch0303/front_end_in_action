import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    proxy: {
      // with options
      '/socket.io': {
        target: 'http://localhost:6001',
        changeOrigin: true,
      },
    }
  }
})

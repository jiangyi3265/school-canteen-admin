import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import canteenWeb from './vite/canteen-web.js'
export default defineConfig({
  plugins: [canteenWeb(), vue()],
  resolve: { dedupe: ['vue'] },
  server: { host: '127.0.0.1', port: 5173, open: false, fs: { allow: [path.resolve('..')] } },
  build: { outDir: 'dist-canteen', rollupOptions: { input: path.resolve('canteen.html') } }
})

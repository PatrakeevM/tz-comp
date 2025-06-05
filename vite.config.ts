import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr(), nodePolyfills()],
  server: {
    watch: {
      usePolling: true, // Включает polling вместо inotify
      interval: 1000, // Интервал проверки (в миллисекундах)
    },
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://o-complex.com:1337',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
      }
    }
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@components": resolve(__dirname, "src/components"),
      "@assets": resolve(__dirname, "src/assets"),
      "@pages": resolve(__dirname, "src/pages"),
    },
  },
  json: {
    stringify: true,
  },
});

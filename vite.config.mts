import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  base: "/vexen-hub/",
  plugins: [react(), tsconfigPaths()],
  server: {
    open: true,
    watch: {
      usePolling: true,
      interval: 1000
    },
    hmr: {
      overlay: true
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests",
    mockReset: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler", // or "modern"
      },
    },
  },
})

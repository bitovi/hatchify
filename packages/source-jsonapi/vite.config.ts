/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/source-jsonapi.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["data-core"],
    },
  },
  plugins: [dts()],
  test: {
    setupFiles: ["./src/setupTests.ts"],
  },
})

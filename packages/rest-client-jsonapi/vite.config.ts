/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/rest-client-jsonapi.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["@hatchifyjs/rest-client"],
    },
  },
  plugins: [dts()],
  test: {
    setupFiles: ["./src/setupTests.ts"],
  },
})

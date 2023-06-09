/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react-jsonapi.tsx",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["@hatchifyjs/react-rest", "@hatchifyjs/rest-client-jsonapi"],
    },
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

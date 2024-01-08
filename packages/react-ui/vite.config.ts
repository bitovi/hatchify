/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react-ui.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react-router-dom",
        "uuid",
        "lodash",
        "@hatchifyjs/core",
        "@hatchifyjs/react-rest",
        "@hatchifyjs/rest-client",
      ],
    },
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

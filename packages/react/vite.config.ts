/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react.tsx",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["@hatchifyjs/design-mui","@hatchifyjs/hatchify-core", "@hatchifyjs/react-ui","@hatchifyjs/rest-client-jsonapi" ,"react", "react-dom" ],
    },
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

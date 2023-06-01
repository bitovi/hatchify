/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/design-mui.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "@hatchifyjs/react-ui", "@mui/material", "@emotion/react","@emotion/styled",  ]
    }
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

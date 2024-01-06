/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/design-mui.ts",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "@hatchifyjs/react-ui",
        "@mui/icons-material",
        "@mui/utils",
        "lodash",
        "react",
        "react-dom",
      ],
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

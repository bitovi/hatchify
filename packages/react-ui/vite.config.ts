/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"
import nodeExternals from "rollup-plugin-node-externals"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react-ui.ts",
      formats: ["es"],
    },
  },
  plugins: [{ ...nodeExternals(), enforce: "pre" }, dts(), react()],
  test: {
    reporters: "verbose",
    globals: true,
    environment: "jsdom",
    coverage: {
      statements: 90,
      branches: 90,
      functions: 75,
      lines: 90,
    },
  },
})

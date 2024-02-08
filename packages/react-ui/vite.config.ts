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
    globals: true,
    environment: "jsdom",
  },
})

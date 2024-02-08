/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from "@vitejs/plugin-react"
import nodeExternals from "rollup-plugin-node-externals"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/design-mui.ts",
      formats: ["es"],
    },
  },
  esbuild: {
    supported: {
      "top-level-await": true,
    },
  },
  plugins: [{ ...nodeExternals(), enforce: "pre" }, dts({ entryRoot: "src" }), react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
})

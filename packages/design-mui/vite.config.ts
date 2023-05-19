/// <reference types="vitest" />
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react.ts",
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts(), react()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
})

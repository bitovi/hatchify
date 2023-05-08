import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react.ts",
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts()],
})

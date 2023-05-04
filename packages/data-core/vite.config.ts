import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/data-core.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["hatchify-core"],
    },
  },
  plugins: [dts()],
})

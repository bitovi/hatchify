import { defineConfig } from "vite"
import dts from "vite-plugin-dts"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/rest-client.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [/node_modules/, "@hatchifyjs/hatchify-core"],
    },
  },
  plugins: [dts()],
})

// todo: remote vite from hathciy-core w/o breaking frontend packages
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/hatchify-core.ts",
      formats: ["es", "cjs"],
    },
  },
  plugins: [dts()],
})

import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import nodeExternals from "rollup-plugin-node-externals"

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "src/react-rest.ts",
      formats: ["es", "cjs"],
    },
  },
  plugins: [{ ...nodeExternals(), enforce: "pre" }, dts()],
})

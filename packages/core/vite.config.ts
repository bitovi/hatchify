// todo: remote vite from hathciy-core w/o breaking frontend packages
import { nodeResolve } from "@rollup/plugin-node-resolve"
import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: "core.ts",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      output: {
        globals: { crypto: "crypto" },
      },
      external: ["crypto"],
      plugins: [nodeResolve({ preferBuiltins: true })],
    },
  },
  plugins: [dts()],
})

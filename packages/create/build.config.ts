import path from "node:path"
import url from "node:url"
import { defineBuildConfig } from "unbuild"

path.dirname(url.fileURLToPath(import.meta.url))

export default defineBuildConfig({
  entries: ["src/index"],
  clean: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: "node18",
      minify: true,
    },
  },
  alias: {
    // we can always use non-transpiled code since we support node 18+
    prompts: "prompts/lib/index.js",
  },
  hooks: {},
})

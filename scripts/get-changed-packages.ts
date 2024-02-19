const dependencies = {
  core: [],
  create: [],
  crypto: ["core"],
  "design-mui": ["react"],
  express: [],
  koa: [],
  node: ["express", "koa"],
  react: [],
  "react-jsonapi": [],
  "react-rest": ["react-jsonapi", "react-ui", "design-mui", "react"],
  "react-ui": ["design-mui", "react"],
  "rest-client": [
    "rest-client-jsonapi",
    "react-rest",
    "react-jsonapi",
    "react-ui",
    "design-mui",
    "react",
  ],
  "rest-client-jsonapi": ["react-jsonapi", "react"],
}

const packagesChanged =
  process.env.TOUCHED_FILES?.split(" ").reduce((acc, filePath) => {
    if (!filePath.startsWith("packages/")) {
      return acc
    }

    const packageName = filePath.split("/")[1] as keyof typeof dependencies
    const dependentPackages = dependencies[packageName]
    return new Set([...acc, packageName, ...dependentPackages])
  }, new Set()) || new Set()

// eslint-disable-next-line no-console
console.log(
  [...packagesChanged]
    .map((packageName) => `${packageName}=publish`)
    .join("\n"),
)

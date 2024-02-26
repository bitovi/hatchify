/* eslint-disable no-console */
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
  "react-rest": [
    "rest-client-jsonapi",
    "react-ui",
    "react-jsonapi",
    "design-mui",
    "react",
  ],
  "react-ui": ["design-mui", "react"],
  "rest-client": [
    "react-rest",
    "rest-client-jsonapi",
    "react-ui",
    "react-jsonapi",
    "design-mui",
    "react",
  ],
  "rest-client-jsonapi": ["react-jsonapi", "react"],
}

const { COMMIT_MESSAGE, TOUCHED_FILES } = process.env

console.log(`segment=${getSegmentFromCommitMessage(COMMIT_MESSAGE)}\n`)

const packagesChanged =
  TOUCHED_FILES?.split(" ").reduce((acc, filePath) => {
    if (!filePath.startsWith("packages/")) {
      return acc
    }

    const packageName = filePath.split("/")[1] as keyof typeof dependencies
    const dependentPackages = dependencies[packageName]
    return new Set([...acc, packageName, ...dependentPackages])
  }, new Set()) || new Set()

console.log(
  [...packagesChanged]
    .map((packageName) => `${packageName}=publish`)
    .join("\n"),
)

function getSegmentFromCommitMessage(commitMessage?: string): string {
  const prefix = commitMessage?.split(":")[0]

  return prefix && ["patch", "minor", "major"].includes(prefix)
    ? prefix
    : "patch"
}

/* eslint-disable no-console */
import fs from "fs"
import path from "path"

const dependencies = getDependencies()

const { COMMIT_MESSAGE, TOUCHED_FILES } = process.env

console.log(`segment=${getSegmentFromCommitMessage(COMMIT_MESSAGE)}\n`)

const packagesChanged =
  TOUCHED_FILES?.split(" ").reduce((acc, filePath) => {
    if (
      !filePath.startsWith("packages/") ||
      filePath.endsWith(".spec.ts") ||
      filePath.endsWith(".test.ts")
    ) {
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

function getDependencies() {
  const packagesPath = path.join(__dirname, "../packages")

  const firstPass = fs
    .readdirSync(packagesPath, {
      withFileTypes: true,
    })
    .reduce(
      (acc, dirent) => {
        if (!dirent.isDirectory()) {
          return acc
        }

        const packagePath = path.join(packagesPath, dirent.name, "package.json")
        const packageString = fs.readFileSync(packagePath, {
          encoding: "utf8",
        })
        const { dependencies, devDependencies } = JSON.parse(packageString)
        const parentPackageName = dirent.name

        if (!acc[parentPackageName]) {
          acc[parentPackageName] = []
        }

        Object.keys({
          ...dependencies,
          ...devDependencies,
        }).forEach((childPackageName) => {
          if (childPackageName.startsWith("@hatchifyjs/")) {
            const suffix = childPackageName.split("/")[1]
            if (!acc[suffix]) {
              acc[suffix] = []
            }
            acc[suffix].push(parentPackageName)
          }
        })

        return acc
      },
      {} as Record<string, string[]>,
    )

  return Object.entries(firstPass).reduce(
    (acc, [packageName, currentDependencies]) => ({
      ...acc,
      [packageName]: [
        ...new Set(
          currentDependencies
            .map((dependency) => [dependency, ...firstPass[dependency]])
            .flat(),
        ),
      ],
    }),
    {} as Record<string, string[]>,
  )
}

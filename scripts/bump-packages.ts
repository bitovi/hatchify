import fs from "fs"
import path from "path"
import spawn from "cross-spawn"

bumpPackages()

async function bumpPackages() {
  const packageName = process.env.npm_config_package
  const cwd = process.cwd()
  const root = path.join(cwd, `packages/${packageName}`)

  const { dependencies, devDependencies } = JSON.parse(
    await fs.promises.readFile(`packages/${packageName}/package.json`, {
      encoding: "utf8",
    }),
  )

  const hatchifyDependencies = Object.keys(dependencies ?? {}).filter((name) =>
    name.startsWith("@hatchifyjs/"),
  )

  const hatchifyDevDependencies = Object.keys(devDependencies ?? {}).filter(
    (name) => name.startsWith("@hatchifyjs/"),
  )

  if (hatchifyDependencies.length) {
    await runCommand(
      `npm install ${hatchifyDependencies
        .map((name) => `${name}@latest`)
        .join(" ")}`,
      root,
    )
  }

  if (hatchifyDevDependencies.length) {
    await runCommand(
      `npm install -D ${hatchifyDevDependencies
        .map((name) => `${name}@latest`)
        .join(" ")}`,
      root,
    )
  }
}

function runCommand(fullCommand: string, cwd: string, silent = false): void {
  const [command, ...args] = fullCommand.split(" ")
  const { status } = spawn.sync(command, args, {
    stdio: silent ? [] : "inherit",
    cwd,
  })

  if (status) {
    process.exit(status)
  }
}

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

  await runCommand(
    `npm install ${Object.keys(dependencies)
      .filter((name) => name.startsWith("@hatchifyjs/"))
      .map((name) => `${name}@latest`)
      .join(" ")}`,
    root,
  )

  await runCommand(
    `npm install -D ${Object.keys(devDependencies)
      .filter((name) => name.startsWith("@hatchifyjs/"))
      .map((name) => `${name}@latest`)
      .join(" ")}`,
    root,
  )
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

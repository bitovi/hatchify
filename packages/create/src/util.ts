import fs from "node:fs"
import path from "node:path"
import spawn from "cross-spawn"

const renameFiles: Record<string, string> = {
  _gitignore: ".gitignore",
}

export async function replaceStringInFile(
  filePath: string,
  searchValue: string,
  replaceValue: string,
): Promise<void> {
  const indexHtml = await fs.promises.readFile(filePath, "utf8")

  await fs.promises.writeFile(
    filePath,
    indexHtml.replaceAll(searchValue, replaceValue),
    "utf8",
  )
}

export function runCommand(
  fullCommand: string,
  cwd: string,
  silent = false,
): void {
  const [command, ...args] = fullCommand.split(" ")
  const { status } = spawn.sync(command, args, {
    stdio: silent ? [] : "inherit",
    cwd,
  })

  if (status) {
    process.exit(status)
  }
}

export function formatTargetDir(
  targetDir: string | undefined,
): string | undefined {
  return targetDir?.trim().replace(/\/+$/g, "")
}

export async function copyFile(src: string, dest: string): Promise<void> {
  const stat = await fs.promises.stat(src)
  if (stat.isDirectory()) {
    await copyDir(src, dest)
  } else {
    await fs.promises.copyFile(src, dest)
  }
}

export function isValidPackageName(projectName: string): boolean {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName,
  )
}

export function toValidPackageName(projectName: string): string {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/^[._]/, "")
    .replace(/[^a-z\d\-~]+/g, "-")
}

export async function copyDir(srcDir: string, destDir: string): Promise<void> {
  const [files] = await Promise.all([
    fs.promises.readdir(srcDir),
    fs.promises.mkdir(destDir, { recursive: true }),
  ])
  await Promise.all(
    files.map((file) =>
      copyFile(
        path.resolve(srcDir, file),
        path.resolve(destDir, renameFiles[file] ?? file),
      ),
    ),
  )
}

export function isEmpty(path: string): boolean {
  const files = fs.readdirSync(path)
  return files.length === 0 || (files.length === 1 && files[0] === ".git")
}

export async function emptyDir(dir: string): Promise<void> {
  if (!fs.existsSync(dir)) {
    return
  }

  const files = await fs.promises.readdir(dir)

  await Promise.all(
    files.map((file) =>
      file === ".git"
        ? null
        : fs.promises.rm(path.resolve(dir, file), {
            recursive: true,
            force: true,
          }),
    ),
  )
}

export function pkgFromUserAgent(userAgent: string | undefined):
  | {
      name: string
      version: string
    }
  | undefined {
  if (!userAgent) {
    return undefined
  }
  const [name, version] = userAgent.split(" ")[0].split("/")
  return { name, version }
}

import fs from "fs"
import path from "path"

interface Package {
  name: string
  private?: boolean
  version: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

const packagesPath = path.join(__dirname, "..", "..", "packages")

const list = fs
  .readdirSync(packagesPath)
  .map((name) => path.join(packagesPath, name, "package.json"))
  .filter((pkg) => fs.existsSync(pkg))
  .map((pkg) => JSON.parse(fs.readFileSync(pkg, "utf-8")) as Package)

const packages: Record<string, Package> = {}
export default packages

for (const pkg of list) {
  packages[pkg.name] = pkg
}

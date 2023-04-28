import semver from "semver"

import packages from "./lib/packages"

for (const pkg of Object.values(packages)) {
  if (!semver.valid(pkg.version)) {
    console.error(`${pkg.name} - Invalid version: ${pkg.version}`)
  }

  if ("private" in pkg) {
    console.error(`${pkg.name} - Package should not be private.`)
  }

  if (pkg.dependencies) {
    for (const [name, range] of Object.entries(pkg.dependencies)) {
      if (packages[name]) {
        if (!semver.satisfies(packages[name].version, range)) {
          console.error(`${pkg.name} - Unsatisfied package: ${name}@${range}`)
        }
      }
    }
  }
}

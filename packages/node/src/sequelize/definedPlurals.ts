import type { HatchifyModel } from "../types"

export function definedPlurals(models: HatchifyModel[]): Map<string, string> {
  const plurals: Map<string, string> = new Map()
  models.forEach((model) => {
    if (model.pluralName) {
      plurals.set(model.name, model.pluralName)
    }
  })
  return plurals
}

import type { HatchifyModel } from "../types"

export function definedPlurals(models: HatchifyModel[]): Record<string, string> {
  return models.reduce((acc, { name, pluralName }) => pluralName ? ({ ...acc, [name]: pluralName }) : acc, {})
}

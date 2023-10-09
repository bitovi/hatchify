import type { HatchifyModel } from "../types"
import { getFullModelName } from "../utils/getFullModelName"

export function definedPlurals(
  models: HatchifyModel[],
): Record<string, string> {
  return models.reduce(
    (acc, model) =>
      model.pluralName
        ? { ...acc, [getFullModelName(model)]: model.pluralName }
        : acc,
    {},
  )
}

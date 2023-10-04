import type { HatchifyModel } from "../types"

export function getFullModelName(model: HatchifyModel): string {
  return !model.namespace ? model.name : `${model.namespace}_${model.name}`
}

import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

export function buildSchemaForModel(
  hatchify: Hatchify,
  modelName: string,
): HatchifyModel {
  return hatchify.models[modelName]
}

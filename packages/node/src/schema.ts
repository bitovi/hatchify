import type { FinalSchema } from "@hatchifyjs/core"

import type { Hatchify } from "./node.js"
import { HatchifySymbolModel } from "./types.js"

export function buildSchemaForModel(
  hatchify: Hatchify,
  modelName: string,
): FinalSchema {
  return hatchify.models[modelName]?.[HatchifySymbolModel]
}

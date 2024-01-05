import type { FinalSchema } from "@hatchifyjs/core"

import type { Hatchify } from "./node"
import { HatchifySymbolModel } from "./types"

export function buildSchemaForModel(
  hatchify: Hatchify,
  modelName: string,
): FinalSchema {
  return hatchify.model[modelName]?.[HatchifySymbolModel]
}

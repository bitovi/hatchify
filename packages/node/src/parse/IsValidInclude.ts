import type { FinalSchema } from "@hatchifyjs/core"

import type { ModelFunctionsCollection } from "../types.js"

export function isValidInclude(
  schemaName: string,
  include: string[],
  allSchemas: ModelFunctionsCollection<FinalSchema>,
): boolean {
  if (!allSchemas[schemaName]) {
    return false
  }

  if (include.length === 0) {
    return false
  }

  if (include.length === 1) {
    return !!allSchemas[schemaName].relationships?.[include[0]]
  }

  if (!allSchemas[schemaName].relationships?.[include[0]]) {
    return false
  }

  return isValidInclude(
    allSchemas[schemaName].relationships?.[include[0]].targetSchema as string,
    include.slice(1),
    allSchemas,
  )
}

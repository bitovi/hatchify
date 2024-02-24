import type { FinalSchema } from "@hatchifyjs/core"

import type { ModelFunctionsCollection } from "../types.js"

export function isValidAttribute(
  schemaName: string,
  relationshipPath: string[],
  allSchemas: ModelFunctionsCollection<FinalSchema>,
): boolean {
  if (!allSchemas[schemaName]) {
    return false
  }

  if (relationshipPath.length === 1) {
    return !!allSchemas[schemaName].attributes[relationshipPath[0]]
  }

  if (!allSchemas[schemaName].relationships) {
    return false
  }

  if (!allSchemas[schemaName].relationships?.[relationshipPath[0]]) {
    return false
  }

  return isValidAttribute(
    allSchemas[schemaName].relationships?.[relationshipPath[0]]
      .targetSchema as string,
    relationshipPath.slice(1),
    allSchemas,
  )
}

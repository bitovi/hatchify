import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute"
import { finalizeRelationships } from "./finalizeRelationships"
import { finalizeSchema } from "./finalizeSchema"
import type { FinalSchema, PartialSchema, SemiFinalSchema } from "./types"
import { HatchifyInvalidSchemaError } from "../types"
import { getSchemaKey } from "../util/getSchemaKey"

export function assembler(
  schemas: Record<string, PartialSchema>,
): Record<string, FinalSchema> {
  const semiFinalSchemas = Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => {
      const expectedKey = getSchemaKey(schema)
      if (expectedKey !== schemaName) {
        throw new HatchifyInvalidSchemaError(
          `Schema key needs to equal ${expectedKey}`,
        )
      }
      return {
        ...acc,
        [schemaName]: finalizeSchema(ensureDefaultPrimaryAttribute(schema)),
      }
    },
    {} as Record<string, SemiFinalSchema>,
  )

  return finalizeRelationships(semiFinalSchemas)
}

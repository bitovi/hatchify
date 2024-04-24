import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute.js"
import { ensureDefaultReadOnlyAttribute } from "./ensureDefaultReadOnlyAttribute.js"
import { finalizeRelationships } from "./finalizeRelationships.js"
import { finalizeSchema } from "./finalizeSchema.js"
import type { FinalSchema, PartialSchema, SemiFinalSchema } from "./types.js"
import { HatchifyInvalidSchemaError } from "../types/index.js"
import { getSchemaKey } from "../util/getSchemaKey.js"

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
        [schemaName]: finalizeSchema(
          ensureDefaultPrimaryAttribute(ensureDefaultReadOnlyAttribute(schema)),
        ),
      }
    },
    {} as Record<string, SemiFinalSchema>,
  )

  return finalizeRelationships(semiFinalSchemas)
}

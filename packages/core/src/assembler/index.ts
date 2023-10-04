import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute"
import { finalizeRelationships } from "./finalizeRelationships"
import { finalizeSchema } from "./finalizeSchema"
import type { FinalSchema, PartialSchema, SemiFinalSchema } from "./types"

export function assembler(
  schemas: Record<string, PartialSchema>,
): Record<string, FinalSchema> {
  const semiFinalSchemas = Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: finalizeSchema(ensureDefaultPrimaryAttribute(schema)),
    }),
    {} as Record<string, SemiFinalSchema>,
  )

  return finalizeRelationships(semiFinalSchemas)
}

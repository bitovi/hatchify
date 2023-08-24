import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute"
import { finalizeSchema } from "./finalizeSchema"
import type { FinalSchema, PartialSchema } from "./types"

export function assembler(schemas: { [schemaName: string]: PartialSchema }): {
  [schemaName: string]: FinalSchema
} {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: finalizeSchema(ensureDefaultPrimaryAttribute(schema)),
    }),
    {},
  )
}

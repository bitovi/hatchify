import type { SchemaV2 } from "./types"

interface Schemas {
  [schemaName: string]: SchemaV2
}

export function assembler(schemas: Schemas): Schemas {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: { ...schema, id: schema.id.primary() },
    }),
    {},
  )
}

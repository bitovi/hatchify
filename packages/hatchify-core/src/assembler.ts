import type { SchemaV2 } from "./types"

export function assemble(schema: SchemaV2): SchemaV2 {
  return {
    ...schema,
    id: schema.id.primary(),
  }
}

import type { PartialHasManyRelationship } from "./types"
import { buildThrough } from "../hasManyThrough/buildThrough"

export function hasMany(
  schemaName?: string,
  props?: {
    targetAttribute: string
  },
): PartialHasManyRelationship {
  const targetSchema = schemaName ?? null

  return {
    type: "hasMany",
    targetSchema,
    targetAttribute: props?.targetAttribute ?? null,
    through: buildThrough(targetSchema),
  }
}
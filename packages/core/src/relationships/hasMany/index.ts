import type { PartialHasManyRelationship } from "./types"
import { buildThrough } from "../hasManyThrough/buildThrough"

// @todo HATCH-417
export function hasMany<TTargetSchema extends string | undefined>(
  schemaName?: TTargetSchema,
  props?: {
    targetAttribute: string
    sourceAttribute?: string
  },
): PartialHasManyRelationship<TTargetSchema> {
  const targetSchema = schemaName ?? null

  return {
    type: "hasMany",
    targetSchema: targetSchema as TTargetSchema,
    targetAttribute: props?.targetAttribute ?? null,
    sourceAttribute: props?.sourceAttribute ?? null,
    through: buildThrough(targetSchema),
  }
}

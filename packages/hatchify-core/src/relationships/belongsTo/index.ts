import type { PartialBelongsToRelationship } from "./types"

export function belongsTo(
  targetSchema?: string,
  props?: {
    sourceAttribute: string
  },
): PartialBelongsToRelationship {
  return {
    type: "belongsTo",
    targetSchema: targetSchema ?? null,
    sourceAttribute: props?.sourceAttribute ?? null,
  }
}

import type { PartialBelongsToRelationship } from "./types"

export function belongsTo<TTargetSchema extends string | undefined | null>(
  targetSchema?: TTargetSchema,
  props?: {
    sourceAttribute: string
    targetAttribute?: string
  },
): PartialBelongsToRelationship<TTargetSchema> {
  return {
    type: "belongsTo",
    targetSchema: targetSchema as TTargetSchema,
    sourceAttribute: props?.sourceAttribute ?? null,
    targetAttribute: props?.targetAttribute ?? null,
  }
}

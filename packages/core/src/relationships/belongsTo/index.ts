import type { PartialBelongsToRelationship } from "./types.js"

// @todo HATCH-417
export function belongsTo<TTargetSchema extends string | undefined | null>(
  targetSchema?: TTargetSchema,
  props?: {
    sourceAttribute: string
    targetAttribute?: string
  },
): PartialBelongsToRelationship<TTargetSchema> {
  return {
    type: "belongsTo",
    targetSchema: (targetSchema ?? null) as TTargetSchema,
    sourceAttribute: props?.sourceAttribute ?? null,
    targetAttribute: props?.targetAttribute ?? null,
  }
}

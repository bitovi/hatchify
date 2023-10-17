import type { PartialHasOneRelationship } from "./types"

export function hasOne<TTargetSchema extends string | undefined>(
  targetSchema?: TTargetSchema,
  props?: {
    targetAttribute: string
    sourceAttribute?: string
  },
): PartialHasOneRelationship<TTargetSchema> {
  return {
    type: "hasOne",
    targetSchema: (targetSchema ?? null) as TTargetSchema,
    targetAttribute: props?.targetAttribute ?? null,
    sourceAttribute: props?.sourceAttribute ?? null,
  }
}

import type { PartialHasOneRelationship } from "./types"

export function hasOne(
  targetSchema?: string,
  props?: {
    targetAttribute: string
  },
): PartialHasOneRelationship {
  return {
    type: "hasOne",
    targetSchema: targetSchema ?? null,
    targetAttribute: props?.targetAttribute ?? null,
  }
}

import type {
  PartialHasManyThroughRelationship,
  ThroughOrAttributes,
} from "./types"

export function buildThrough(targetSchema: string | null) {
  return function through(
    throughOrAttributes?: ThroughOrAttributes,
  ): PartialHasManyThroughRelationship {
    if (throughOrAttributes == null) {
      return {
        type: "hasManyThrough",
        targetSchema,
        through: null,
        throughTargetAttribute: null,
        throughSourceAttribute: null,
      }
    }

    if (typeof throughOrAttributes === "string") {
      return {
        type: "hasManyThrough",
        targetSchema,
        through: throughOrAttributes,
        throughTargetAttribute: null,
        throughSourceAttribute: null,
      }
    }

    if ("sourceKey" in throughOrAttributes) {
      return {
        type: "hasManyThrough",
        targetSchema,
        through: null,
        throughTargetAttribute: null,
        throughSourceAttribute: null,
        ...throughOrAttributes,
      }
    }

    return {
      type: "hasManyThrough",
      targetSchema,
      through: null,
      ...throughOrAttributes,
    }
  }
}

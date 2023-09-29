import type {
  PartialHasManyThroughRelationship,
  ThroughOrAttributes,
} from "./types"

export function buildThrough(targetSchema: string | null) {
  return function through(
    throughOrAttributes?: ThroughOrAttributes,
  ): PartialHasManyThroughRelationship {
    const baseFields = {
      type: "hasManyThrough" as const,
      targetSchema,
    }

    if (throughOrAttributes == null) {
      return {
        ...baseFields,
        through: null,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
      }
    }

    if (typeof throughOrAttributes === "string") {
      return {
        ...baseFields,
        through: throughOrAttributes,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
      }
    }

    if ("sourceKey" in throughOrAttributes) {
      return {
        ...baseFields,
        through: null,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
        ...throughOrAttributes,
      }
    }

    return {
      ...baseFields,
      through: null,
      ...throughOrAttributes,
    }
  }
}

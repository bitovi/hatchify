import type {
  PartialHasManyThroughRelationship,
  ThroughOptions,
} from "./types.js"

export function buildThrough(targetSchema: string | null) {
  return function through(
    through?: string | null,
    options?: ThroughOptions,
  ): PartialHasManyThroughRelationship {
    const baseFields = {
      type: "hasManyThrough" as const,
      targetSchema,
      through: through ?? null,
    }

    if (options) {
      if ("throughSourceAttribute" in options) {
        return {
          ...baseFields,
          ...options,
        }
      }

      if ("sourceKey" in options) {
        return {
          ...baseFields,
          throughSourceAttribute: null,
          throughTargetAttribute: null,
          ...options,
        }
      }
    }

    return {
      ...baseFields,
      throughSourceAttribute: null,
      throughTargetAttribute: null,
    }
  }
}

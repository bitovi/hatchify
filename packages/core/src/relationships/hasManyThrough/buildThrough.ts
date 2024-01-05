import type { PartialHasManyThroughRelationship, ThroughOptions } from "./types"

export function buildThrough<TTargetSchema extends string | undefined | null>(
  targetSchema: TTargetSchema,
) {
  return function through(
    through?: string | null,
    options?: ThroughOptions,
  ): PartialHasManyThroughRelationship<TTargetSchema> {
    const baseFields = {
      type: "hasManyThrough" as const,
      targetSchema: targetSchema as TTargetSchema,
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

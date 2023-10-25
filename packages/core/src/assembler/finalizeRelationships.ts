import type { FinalSchema, SemiFinalSchema } from "./types"
import { finalize as finalizeBelongsTo } from "../relationships/belongsTo/finalize"
import { finalize as finalizeHasMany } from "../relationships/hasMany/finalize"
import type { PartialHasManyRelationship } from "../relationships/hasMany/types"
import { finalize as finalizeHasManyThrough } from "../relationships/hasManyThrough/finalize"
import type { PartialHasManyThroughRelationship } from "../relationships/hasManyThrough/types"
import { finalize as finalizeHasOne } from "../relationships/hasOne/finalize"

export function finalizeRelationships(
  semiFinalSchemas: Record<string, SemiFinalSchema>,
): Record<string, FinalSchema> {
  return Object.entries(semiFinalSchemas).reduce(
    (schemaAcc, [schemaName, schema]) =>
      Object.entries(schema.relationships ?? {}).reduce(
        (relationshipAcc, [relationshipName, relationship]) => {
          if (relationship.type === "belongsTo") {
            return finalizeBelongsTo(
              schemaName,
              relationship,
              relationshipName,
              relationshipAcc,
            ) as Record<string, FinalSchema>
          }

          if (relationship.type === "hasMany") {
            return finalizeHasMany(
              schemaName,
              relationship as PartialHasManyRelationship<string>, // @todo HATCH-417
              relationshipName,
              relationshipAcc,
            ) as Record<string, FinalSchema>
          }

          if (relationship.type === "hasManyThrough") {
            return finalizeHasManyThrough(
              schemaName,
              relationship as PartialHasManyThroughRelationship,
              relationshipName,
              relationshipAcc,
            ) as Record<string, FinalSchema>
          }

          return finalizeHasOne(
            schemaName,
            relationship,
            relationshipName,
            relationshipAcc,
          ) as Record<string, FinalSchema>
        },
        schemaAcc,
      ),
    semiFinalSchemas as Record<string, FinalSchema>,
  )
}

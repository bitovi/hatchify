import type { FinalSchema, SemiFinalSchema } from "./types"
import { finalize as finalizeBelongsTo } from "../relationships/belongsTo/finalize"
import { finalize as finalizeHasMany } from "../relationships/hasMany/finalize"
import type { PartialHasManyRelationship } from "../relationships/hasMany/types"
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
              schemaAcc,
            ) as Record<string, FinalSchema>
          }
          if (relationship.type === "hasMany") {
            return finalizeHasMany(
              schemaName,
              relationship as PartialHasManyRelationship,
              relationshipName,
              schemaAcc,
            ) as Record<string, FinalSchema>
          }
          /* c8 ignore start */
          if (relationship.type === "hasManyThrough") {
            // TODO: hasManyThrough
          }
          if (relationship.type === "hasOne") {
            return finalizeHasOne(
              schemaName,
              relationship,
              relationshipName,
              schemaAcc,
            ) as Record<string, FinalSchema>
          }
          return relationshipAcc
          /* c8 ignore end */
        },
        schemaAcc,
      ),
    semiFinalSchemas as Record<string, FinalSchema>,
  )
}

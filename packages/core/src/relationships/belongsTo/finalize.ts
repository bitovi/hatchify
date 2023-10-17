import type { PartialBelongsToRelationship } from "./types"
import { uuid } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { SemiFinalSchema } from "../../types"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase"

export function finalize(
  sourceSchema: string,
  relationship: PartialBelongsToRelationship<string | undefined>,
  relationshipName: string,
  schemas: Record<string, SemiFinalSchema>,
): Record<string, SemiFinalSchema> {
  const targetSchema =
    relationship.targetSchema ?? camelCaseToPascalCase(relationshipName)

  if (!schemas[targetSchema]) {
    throw new HatchifyInvalidSchemaError(
      `Schema '${targetSchema}' is undefined`,
    )
  }

  const sourceAttribute =
    relationship.sourceAttribute ?? `${relationshipName}Id`
  const targetAttribute = relationship.targetAttribute ?? "id"

  return {
    ...schemas,
    [sourceSchema]: {
      ...schemas[sourceSchema],
      attributes: {
        ...schemas[sourceSchema].attributes,
        [sourceAttribute]:
          schemas[sourceSchema].attributes[sourceAttribute] ??
          uuid().finalize(),
      },
      relationships: {
        ...schemas[sourceSchema].relationships,
        [relationshipName]: {
          type: "belongsTo",
          targetSchema,
          sourceAttribute,
          targetAttribute,
        },
      },
    },
  }
}

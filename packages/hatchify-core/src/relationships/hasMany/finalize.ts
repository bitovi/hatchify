import type { PartialHasManyRelationship } from "./types"
import { integer } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { FinalAttributeRecord, SemiFinalSchema } from "../../types"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase"
import { pascalCaseToCamelCase } from "../../util/pascalCaseToCamelCase"
import { singularize } from "../../util/singularize"
import type { FinalRelationship, PartialRelationship } from "../types"

export function finalize(
  sourceSchema: string,
  relationship: PartialHasManyRelationship,
  relationshipName: string,
  schemas: Record<string, SemiFinalSchema>,
): Record<string, SemiFinalSchema> {
  const targetSchema =
    relationship.targetSchema ??
    camelCaseToPascalCase(singularize(relationshipName))

  if (!schemas[targetSchema]) {
    throw new HatchifyInvalidSchemaError(
      `Schema '${targetSchema}' is undefined`,
    )
  }

  const targetAttribute =
    relationship.targetAttribute ?? `${pascalCaseToCamelCase(sourceSchema)}Id`

  const relationships: Record<string, PartialRelationship | FinalRelationship> =
    {
      ...schemas[sourceSchema].relationships,
      [relationshipName]: {
        type: "hasMany",
        targetSchema,
        targetAttribute,
      },
    }

  const attributes: FinalAttributeRecord = {
    ...schemas[targetSchema].attributes,
    [targetAttribute]:
      schemas[targetSchema].attributes[targetAttribute] ?? integer().finalize(),
  }

  return {
    ...schemas,
    ...(targetSchema === sourceSchema
      ? {
          [sourceSchema]: {
            ...schemas[sourceSchema],
            attributes,
            relationships,
          },
        }
      : {
          [sourceSchema]: {
            ...schemas[sourceSchema],
            relationships,
          },
          [targetSchema]: {
            ...schemas[targetSchema],
            attributes,
          },
        }),
  }
}
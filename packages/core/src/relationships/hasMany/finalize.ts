import type { PartialHasManyRelationship } from "./types"
import { uuid } from "../../dataTypes"
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
  const sourceAttribute = relationship.sourceAttribute ?? "id"
  const targetAttributeValue =
    schemas[targetSchema].attributes[targetAttribute] ??
    uuid({ hidden: true }).finalize()

  const relationships: Record<string, PartialRelationship | FinalRelationship> =
    {
      ...schemas[sourceSchema].relationships,
      [relationshipName]: {
        type: "hasMany",
        targetSchema,
        targetAttribute,
        sourceAttribute,
      },
    }

  const attributes: FinalAttributeRecord = {
    ...schemas[targetSchema].attributes,
    [targetAttribute]: targetAttributeValue,
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

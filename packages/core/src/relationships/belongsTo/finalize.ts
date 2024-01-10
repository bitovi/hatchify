import type { PartialBelongsToRelationship } from "./types.js"
import { uuid } from "../../dataTypes/index.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"
import type { SemiFinalSchema } from "../../types/index.js"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase.js"

// @todo HATCH-417
export function finalize(
  sourceSchema: string,
  relationship: PartialBelongsToRelationship<string | undefined | null>,
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
  const sourceAttributeValue =
    schemas[sourceSchema].attributes[sourceAttribute] ?? uuid().finalize()

  return {
    ...schemas,
    [sourceSchema]: {
      ...schemas[sourceSchema],
      attributes: {
        ...schemas[sourceSchema].attributes,
        [sourceAttribute]: {
          ...sourceAttributeValue,
          control: {
            ...sourceAttributeValue.control,
            hidden: true,
          },
        },
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

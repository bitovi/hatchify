import type { PartialHasOneRelationship } from "./types.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"
import type {
  FinalAttributeRecord,
  SemiFinalSchema,
} from "../../types/index.js"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase.js"
import { pascalCaseToCamelCase } from "../../util/pascalCaseToCamelCase.js"
import type { FinalRelationship, PartialRelationship } from "../types.js"
import { getForeignKeyAttribute } from "../utils/getForeignKeyAttribute.js"

// @todo HATCH-417
export function finalize(
  sourceSchema: string,
  relationship: PartialHasOneRelationship<string | null | undefined>,
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

  const targetAttribute =
    relationship.targetAttribute ?? `${pascalCaseToCamelCase(sourceSchema)}Id`
  const sourceAttribute = relationship.sourceAttribute ?? "id"
  const targetAttributeValue =
    schemas[targetSchema].attributes[targetAttribute] ??
    getForeignKeyAttribute(schemas[sourceSchema].id)

  const relationships: Record<string, PartialRelationship | FinalRelationship> =
    {
      ...schemas[sourceSchema].relationships,
      [relationshipName]: {
        type: "hasOne",
        targetSchema,
        targetAttribute,
        sourceAttribute,
      },
    }

  const attributes: FinalAttributeRecord = {
    ...schemas[targetSchema].attributes,
    [targetAttribute]: {
      ...targetAttributeValue,
      control: {
        ...targetAttributeValue.control,
        ui: {
          ...targetAttributeValue.control.ui,
          displayName: null,
          hidden: true,
          enableCaseSensitiveContains: false,
        },
      },
    },
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

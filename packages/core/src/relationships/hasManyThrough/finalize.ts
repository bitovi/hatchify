import type { PartialHasManyThroughRelationship } from "./types.js"
import { getDefaultPrimaryAttribute } from "../../assembler/getDefaultPrimaryAttribute.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"
import type { SemiFinalSchema } from "../../types/index.js"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase.js"
import { pascalCaseToCamelCase } from "../../util/pascalCaseToCamelCase.js"
import { pluralize } from "../../util/pluralize.js"
import { singularize } from "../../util/singularize.js"
import { getForeignKeyAttribute } from "../utils/getForeignKeyAttribute.js"

export function finalize(
  sourceSchema: string,
  relationship: PartialHasManyThroughRelationship<string | null | undefined>,
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

  const through =
    relationship.through ?? [sourceSchema, targetSchema].sort().join("")

  const throughSourceAttribute =
    relationship.throughSourceAttribute ??
    `${pascalCaseToCamelCase(sourceSchema)}Id`

  const throughTargetAttribute =
    relationship.throughTargetAttribute ?? `${singularize(relationshipName)}Id`

  const sourceKey = relationship.sourceKey ?? "id"
  const targetKey = relationship.targetKey ?? "id"

  const sourceAttributeValue = getForeignKeyAttribute(
    schemas[sourceSchema].attributes[sourceKey] ?? schemas[sourceSchema].id,
    true,
  )
  const targetAttributeValue = getForeignKeyAttribute(
    schemas[targetSchema].attributes[targetKey] ?? schemas[targetSchema].id,
    true,
  )
  const throughRelationshipName = pluralize(pascalCaseToCamelCase(through))

  return {
    ...schemas,
    [sourceSchema]: {
      ...schemas[sourceSchema],
      relationships: {
        ...schemas[sourceSchema].relationships,
        [relationshipName]: {
          type: "hasManyThrough",
          targetSchema,
          through,
          throughSourceAttribute,
          throughTargetAttribute,
          sourceKey,
          targetKey,
        },
        [throughRelationshipName]: {
          type: "hasMany",
          targetSchema: through,
          targetAttribute: throughSourceAttribute,
          sourceAttribute: sourceKey,
        },
      },
    },
    ...(schemas[through]
      ? {}
      : {
          [through]: {
            name: through,
            id: getDefaultPrimaryAttribute().finalize(),
            ui: {},
            attributes: {
              [throughSourceAttribute]: {
                ...sourceAttributeValue,
                control: {
                  ...sourceAttributeValue.control,
                  ui: {
                    ...sourceAttributeValue.control.ui,
                    displayName: null,
                    hidden: true,
                    enableCaseSensitiveContains: false,
                  },
                },
              },
              [throughTargetAttribute]: {
                ...targetAttributeValue,
                control: {
                  ...targetAttributeValue.control,
                  ui: {
                    ...sourceAttributeValue.control.ui,
                    displayName: null,
                    hidden: true,
                    enableCaseSensitiveContains: false,
                  },
                },
              },
            },
            relationships: {
              [pascalCaseToCamelCase(sourceSchema)]: {
                type: "belongsTo",
                targetSchema: sourceSchema,
                sourceAttribute: throughSourceAttribute,
                targetAttribute: sourceKey,
              },
              [pascalCaseToCamelCase(targetSchema)]: {
                type: "belongsTo",
                targetSchema,
                sourceAttribute: throughTargetAttribute,
                targetAttribute: targetKey,
              },
            },
            readOnly: false,
          },
        }),
  }
}

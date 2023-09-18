import type { PartialHasManyThroughRelationship } from "./types"
import { getDefaultPrimaryAttribute } from "../../assembler/getDefaultPrimaryAttribute"
import { integer } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { SemiFinalSchema } from "../../types"
import { camelCaseToPascalCase } from "../../util/camelCaseToPascalCase"
import { pascalCaseToCamelCase } from "../../util/pascalCaseToCamelCase"
import { singularize } from "../../util/singularize"

export function finalize(
  sourceSchema: string,
  relationship: PartialHasManyThroughRelationship,
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
      },
    },
    [through]: {
      ...schemas[through],
      name: through,
      id: getDefaultPrimaryAttribute().finalize(),
      attributes: {
        [throughSourceAttribute]: integer({ required: true }).finalize(),
        [throughTargetAttribute]: integer({ required: true }).finalize(),
      },
    },
  }
}

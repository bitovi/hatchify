import { assembler } from "@hatchifyjs/core"
import type { FinalAttributeRecord, PartialSchema } from "@hatchifyjs/core"

export function v2ToV1(schemas: Record<string, PartialSchema>) {
  return Object.entries(assembler(schemas)).reduce(
    (schemaAcc, [schemaName, { id, relationships, ...schema }]) => ({
      ...schemaAcc,
      [schemaName]: {
        ...schema,
        attributes: {
          id: transformAttribute(id),
          ...Object.entries(schema.attributes).reduce(
            (acc, [attributeName, attribute]) => ({
              ...acc,
              [attributeName]: transformAttribute(attribute),
            }),
            {},
          ),
        },
        ...Object.entries(relationships ?? {}).reduce(
          (relationshipAcc, [relationshipName, relationship]) => {
            const type =
              relationship.type === "hasManyThrough"
                ? "belongsToMany"
                : relationship.type
            return {
              ...relationshipAcc,
              [type]: [
                ...relationshipAcc[type],
                {
                  target: relationship.targetSchema,
                  options: {
                    as: relationshipName,
                    foreignKey:
                      ("sourceAttribute" in relationship &&
                        relationship.sourceAttribute) ||
                      ("targetAttribute" in relationship &&
                        relationship.targetAttribute),
                  },
                },
              ],
            }
          },
          {
            belongsTo: [],
            belongsToMany: [],
            hasMany: [],
            hasOne: [],
          },
        ),
      },
    }),
    {},
  )
}

function transformAttribute({
  orm,
}: FinalAttributeRecord[keyof FinalAttributeRecord]) {
  let sequelize
  let typeArgs: number[] | string[] = []

  if ("typeArgs" in orm.sequelize) {
    ;({ typeArgs, ...sequelize } = orm.sequelize)
  } else {
    sequelize = orm.sequelize
  }

  return {
    ...sequelize,
    ...(typeArgs?.length ? { typeArgs } : {}),
    ...(sequelize.type === "ENUM" && "typeArgs" in sequelize
      ? { values: typeArgs }
      : {}),
  }
}

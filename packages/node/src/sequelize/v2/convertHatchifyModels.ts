import { assembler, pascalCaseToCamelCase, singularize } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type { ICreateHatchifyModel } from "@hatchifyjs/sequelize-create-with-associations"
import type JSONAPISerializer from "json-api-serializer"
import type { Sequelize } from "sequelize"

import { toSequelize } from "./toSequelize"
import { registerSchema } from "../../serialize"
import { HatchifySymbolModel } from "../../types"
import type { HatchifyModel, SequelizeModelsCollection } from "../../types"
import { getFullModelName } from "../../utils/getFullModelName"
import { pluralize } from "../../utils/pluralize"
import { definedPlurals } from "../definedPlurals"

export function convertHatchifyModels(
  sequelize: Sequelize,
  serializer: JSONAPISerializer,
  partialSchemas: { [schemaName: string]: PartialSchema },
): ICreateHatchifyModel {
  const finalSchemas = assembler(partialSchemas)

  toSequelize(finalSchemas, sequelize)

  const hatchifyModels = Object.values(finalSchemas).map((schema) => {
    const model: HatchifyModel = {
      name: schema.name,
      namespace: schema.namespace,
      pluralName: schema.pluralName,
      attributes: Object.entries(schema.attributes).reduce(
        (acc, [attributeName, attribute]) => ({
          ...acc,
          [attributeName]: attribute.orm.sequelize,
        }),
        {},
      ),
      ...Object.entries(schema.relationships ?? {}).reduce(
        (acc, [as, relationship]) => {
          if (relationship.type === "belongsTo") {
            return {
              ...acc,
              belongsTo: [
                ...acc.belongsTo,
                {
                  target: relationship.targetSchema,
                  options: {
                    as,
                    foreignKey: relationship.sourceAttribute,
                    targetKey: relationship.targetAttribute,
                  },
                },
              ],
            }
          }
          if (relationship.type === "hasOne") {
            return {
              ...acc,
              hasOne: [
                ...acc.hasOne,
                {
                  target: relationship.targetSchema,
                  options: {
                    as,
                    foreignKey: relationship.targetAttribute,
                    sourceKey: relationship.sourceAttribute,
                  },
                },
              ],
            }
          }
          if (relationship.type === "hasMany") {
            return {
              ...acc,
              hasMany: [
                ...acc.hasMany,
                {
                  target: relationship.targetSchema,
                  options: {
                    as,
                    foreignKey: relationship.targetAttribute,
                    sourceKey: relationship.sourceAttribute,
                  },
                },
              ],
            }
          }
          if (relationship.type === "hasManyThrough") {
            return {
              ...acc,
              belongsToMany: [
                ...acc.belongsToMany,
                {
                  target: relationship.targetSchema,
                  options: {
                    as: pluralize(
                      pascalCaseToCamelCase(relationship.targetSchema),
                    ),
                    through: relationship.through,
                    foreignKey: relationship.throughSourceAttribute,
                    otherKey: relationship.throughTargetAttribute,
                  },
                },
              ],
              hasMany: [
                ...acc.hasMany,
                {
                  target: relationship.through,
                  options: {
                    as: pluralize(pascalCaseToCamelCase(relationship.through)),
                    foreignKey: relationship.throughSourceAttribute,
                    sourceKey: relationship.sourceKey,
                  },
                },
              ],
            }
          }
          return acc
        },
        { belongsTo: [], hasMany: [], hasOne: [], belongsToMany: [] },
      ),
    }

    sequelize.models[getFullModelName(model)][HatchifySymbolModel] = model

    return model
  })

  // Create the serializer schema for the model
  const associationsLookup = hatchifyModels.reduce((modelAcc, model) => {
    const fullModelName = getFullModelName(model)

    const associations = Object.entries(
      finalSchemas[fullModelName].relationships ?? {},
    ).reduce((relationshipAcc, [relationshipName, relationship]) => {
      const { type, targetSchema } = relationship

      if (type === "hasManyThrough") {
        sequelize.models[relationship.through].belongsTo(
          sequelize.models[fullModelName],
          {
            as: pascalCaseToCamelCase(fullModelName),
            foreignKey: relationship.throughSourceAttribute,
            targetKey: relationship.sourceKey,
          },
        )
        sequelize.models[fullModelName].belongsToMany(
          sequelize.models[targetSchema],
          {
            as: relationshipName,
            through: {
              model: sequelize.models[relationship.through],
              unique: false,
            },
            foreignKey: relationship.throughSourceAttribute,
            otherKey: relationship.throughTargetAttribute,
          },
        )
        sequelize.models[getFullModelName(model)].hasMany(
          sequelize.models[relationship.through],
          {
            as: pluralize(pascalCaseToCamelCase(relationship.through)),
            foreignKey: relationship.throughSourceAttribute,
            sourceKey: relationship.sourceKey,
          },
        )
      } else if (type === "belongsTo") {
        sequelize.models[getFullModelName(model)][type](
          sequelize.models[targetSchema],
          {
            as: relationshipName,
            foreignKey: relationship.sourceAttribute,
            targetKey: relationship.targetAttribute,
          },
        )
      } else {
        sequelize.models[getFullModelName(model)][type](
          sequelize.models[targetSchema],
          {
            as: relationshipName,
            foreignKey: relationship.targetAttribute,
            sourceKey: relationship.sourceAttribute,
          },
        )
      }

      return {
        ...relationshipAcc,
        [relationshipName]: {
          type,
          model: targetSchema,
          key: `${singularize(relationshipName)}_id`,
        },
        ...("through" in relationship
          ? {
              [pluralize(pascalCaseToCamelCase(relationship.through))]: {
                type: "hasMany",
                model: relationship.through,
                key: `${singularize(relationshipName)}_id`,
              },
            }
          : {}),
      }
    }, {})

    registerSchema(serializer, model, associations, "id")

    return { ...modelAcc, [getFullModelName(model)]: associations }
  }, {})

  return {
    associationsLookup,
    models: sequelize.models as SequelizeModelsCollection,
    virtuals: {},
    plurals: definedPlurals(hatchifyModels),
  }
}

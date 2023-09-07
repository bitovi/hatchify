import { assembler, singularize } from "@hatchifyjs/hatchify-core"
import type { PartialSchema } from "@hatchifyjs/hatchify-core"
import type { ICreateHatchifyModel } from "@hatchifyjs/sequelize-create-with-associations"
import type JSONAPISerializer from "json-api-serializer"
import type { Sequelize } from "sequelize"

import { toSequelize } from "./toSequelize"
import { registerSchema } from "../../serialize"
import { HatchifySymbolModel } from "../../types"
import type { HatchifyModel, SequelizeModelsCollection } from "../../types"
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
                  options: { as },
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
                  options: { as },
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
                  options: { as },
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
                    as,
                    through: relationship.through,
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

    sequelize.models[schema.name][HatchifySymbolModel] = model

    return model
  })

  // Create the serializer schema for the model
  const associationsLookup = hatchifyModels.reduce((modelAcc, model) => {
    const associations = Object.entries(
      finalSchemas[model.name].relationships ?? {},
    ).reduce((relationshipAcc, [relationshipName, { type, targetSchema }]) => {
      sequelize.models[model.name][type](sequelize.models[targetSchema], {
        as: relationshipName,
      })

      return {
        ...relationshipAcc,
        [relationshipName]: {
          type,
          model: targetSchema,
          key: `${singularize(relationshipName)}_id`,
        },
      }
    }, {})

    registerSchema(serializer, model, associations, "id")

    return { ...modelAcc, [model.name]: associations }
  }, {})

  return {
    associationsLookup,
    models: sequelize.models as SequelizeModelsCollection,
    virtuals: {},
    plurals: definedPlurals(hatchifyModels),
  }
}

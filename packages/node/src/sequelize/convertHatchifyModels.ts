import {
  assembler,
  pascalCaseToCamelCase,
  pluralize,
  singularize,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import type JSONAPISerializer from "json-api-serializer"

import { toSequelize } from "./toSequelize"
import { registerSchema } from "../serialize"
import { HatchifySymbolModel } from "../types"
import type {
  ICreateHatchifyModel,
  SequelizeModelsCollection,
  SequelizeWithHatchify,
} from "../types"
import { getFullModelName } from "../utils/getFullModelName"

export function convertHatchifyModels(
  sequelize: SequelizeWithHatchify,
  serializer: JSONAPISerializer,
  partialSchemas: { [schemaName: string]: PartialSchema },
): ICreateHatchifyModel {
  const finalSchemas = assembler(partialSchemas)

  toSequelize(finalSchemas, sequelize)

  const hatchifyModels = Object.values(finalSchemas)
  hatchifyModels.forEach((schema) => {
    sequelize.models[getFullModelName(schema)][HatchifySymbolModel] = schema
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
            sourceKey: relationship.sourceKey,
            targetKey: relationship.targetKey,
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
    finalSchemas,
    models: sequelize.models as SequelizeModelsCollection,
  }
}

import querystringParser from "@bitovi/sequelize-querystring-parser"
import type {
  IAssociation,
  ICreateHatchifyModel,
} from "@hatchifyjs/sequelize-create-with-associations"
import type JSONAPISerializer from "json-api-serializer"
import { camelCase, snakeCase } from "lodash"
import { DataTypes } from "sequelize"
import type { Model, Sequelize } from "sequelize"

import { parseAttribute } from "./parseAttribute"
import { HatchifyError, codes, statusCodes } from "../../error"
import { registerSchema } from "../../serialize"
import { HatchifySymbolModel } from "../../types"
import type {
  HatchifyModel,
  SequelizeModelsCollection,
  Virtuals,
} from "../../types"
import { pluralize } from "../../utils/pluralize"
import { definedPlurals } from "../definedPlurals"

function getModelFullName(model: HatchifyModel): string {
  return [model.namespace, model.name].filter((x) => x).join(".")
}

export function convertHatchifyModels(
  sequelize: Sequelize,
  serializer: JSONAPISerializer,
  models: HatchifyModel[],
): ICreateHatchifyModel {
  const virtuals: Virtuals = {}
  const primaryKeys: Record<string, string> = {}
  models.forEach((model) => {
    const modelFullName = getModelFullName(model)

    for (const attributeKey in model.attributes) {
      const attribute = model.attributes[attributeKey]
      const parsedAttribute = parseAttribute(attribute)
      const { type, include } = parsedAttribute

      let updatedInclude = include
      if (updatedInclude) {
        updatedInclude = Array.isArray(include) ? include : [include]
        const query = `include=${updatedInclude.join(",")}`
        const parser = querystringParser.parse(query)
        if (parser.errors.length === 0) {
          updatedInclude = parser.data.include
        }
      }

      if (type instanceof DataTypes.VIRTUAL) {
        if (virtuals[modelFullName]) {
          virtuals[modelFullName][attributeKey] = updatedInclude || []
        } else {
          virtuals[modelFullName] = {
            [attributeKey]: updatedInclude || [],
          }
        }

        include && delete attribute.include
      }

      model.attributes[attributeKey] = parsedAttribute
    }

    const temp = sequelize.define<Model<HatchifyModel["attributes"]>>(
      modelFullName,
      model.attributes,
      {
        validate: model.validation || {},
        schema: model.namespace || "",
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
        tableName: snakeCase(model.name),
      },
    )

    // GET THE PRIMARY KEY
    primaryKeys[modelFullName] = temp.primaryKeyAttribute

    temp[HatchifySymbolModel] = model
  })

  const associationsLookup: Record<string, Record<string, IAssociation>> = {}

  models.forEach((model) => {
    const modelFullName = getModelFullName(model)

    const relationshipTypes = [
      "belongsTo",
      "belongsToMany",
      "hasOne",
      "hasMany",
    ]
    const associations: Record<string, IAssociation> = {}

    relationshipTypes.forEach((relationshipType) => {
      // For each relationship type, check if we have definitions for it:
      if (model[relationshipType]) {
        // Grab the array of targets and options
        model[relationshipType].forEach(({ target, options }) => {
          if (!target || !sequelize.models[target]) {
            throw [
              new HatchifyError({
                title:
                  "Unknown Model association for " +
                  modelFullName +
                  " in " +
                  relationshipType,
                status: statusCodes.CONFLICT,
                code: codes.ERR_CONFLICT,
              }),
            ]
          }

          //Get association name for lookup
          const associationName =
            options?.as ??
            camelCase(
              ["belongsToMany", "hasMany"].includes(relationshipType)
                ? pluralize(target)
                : target,
            )

          // Pull the models off sequelize.models
          const current = sequelize.models[modelFullName]
          const associated = sequelize.models[target]

          // Create the relationship
          current[relationshipType](associated, {
            ...options,
            as: associationName,
          })

          // Add association details to a lookup for each model
          const modelAssociation = {
            type: relationshipType,
            model: target,
            key: options?.foreignKey ?? `${target.toLowerCase()}_id`,
            joinTable:
              relationshipType === "belongsToMany"
                ? typeof options.through === "string"
                  ? options?.through
                  : options?.through.model
                : undefined,
          }
          associationsLookup[modelFullName] = {
            ...associationsLookup[modelFullName],
            [associationName]: modelAssociation,
          }
          associations[associationName] = modelAssociation
        })
      }
    })
    // Create the serializer schema for the model
    registerSchema(serializer, model, associations, primaryKeys[modelFullName])
  })

  return {
    associationsLookup,
    models: sequelize.models as SequelizeModelsCollection,
    virtuals,
    plurals: definedPlurals(models),
  }
}

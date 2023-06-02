import querystringParser from "@bitovi/sequelize-querystring-parser"
import extendSequelize from "@hatchifyjs/sequelize-create-with-associations"
import type {
  IAssociation,
  ICreateHatchifyModel,
} from "@hatchifyjs/sequelize-create-with-associations"
import * as inflection from "inflection"
import type JSONAPISerializer from "json-api-serializer"
import type { Model, Options } from "sequelize"
import { DataTypes, Sequelize } from "sequelize"

import { codes, statusCodes } from "../error/constants"
import { HatchifyError } from "../error/errors"
import { registerSchema } from "../serialize"
import type {
  HatchifyModel,
  HatchifyModelCollection,
  SequelizeModelsCollection,
  Virtuals,
} from "../types"
import { HatchifySymbolModel } from "../types"

const splitIncludeToJSONAPiQuery = (include) => {
  return `include=${include.join(",")}`
}

export function buildHatchifyModelObject(
  models: SequelizeModelsCollection,
): HatchifyModelCollection {
  const names = Object.keys(models)

  const result: HatchifyModelCollection = {}
  names.forEach((name) => {
    result[name] = models[name][HatchifySymbolModel]
  })
  return result
}

export function createSequelizeInstance(options?: Options): Sequelize {
  extendSequelize(Sequelize)

  if (!options) {
    return new Sequelize("sqlite::memory:", {
      logging: false,
    })
  }

  return new Sequelize(options)
}

export function convertHatchifyModels(
  sequelize: Sequelize,
  serializer: JSONAPISerializer,
  models: HatchifyModel[],
): ICreateHatchifyModel {
  const virtuals: Virtuals = {}
  const primaryKeys: Record<string, string> = {}
  models.forEach((model) => {
    for (const attributeKey in model.attributes) {
      const attribute = model.attributes[attributeKey]
      const { type, include } = attribute

      let updatedInclude = include
      if (updatedInclude) {
        updatedInclude = Array.isArray(include) ? include : [include]
        const query = splitIncludeToJSONAPiQuery(updatedInclude)
        const parser = querystringParser.parse(query)
        if (parser.errors.length === 0) {
          updatedInclude = parser.data.include
        }
      }

      if (
        type instanceof DataTypes.VIRTUAL ||
        (type && type.key === "VIRTUAL")
      ) {
        if (virtuals[model.name]) {
          virtuals[model.name][attributeKey] = updatedInclude || []
        } else {
          virtuals[model.name] = {
            [attributeKey]: updatedInclude || [],
          }
        }

        include && delete attribute.include
      }
    }

    const temp = sequelize.define<Model<HatchifyModel["attributes"]>>(
      model.name,
      model.attributes,
      {
        validate: model.validation || {},
        underscored: true,
        createdAt: false,
        updatedAt: false,
        freezeTableName: true,
      },
    )

    // GET THE PRIMARY KEY
    primaryKeys[model.name] = temp.primaryKeyAttribute

    temp[HatchifySymbolModel] = model
  })

  const associationsLookup: Record<string, Record<string, IAssociation>> = {}

  models.forEach((model) => {
    const relationships = ["belongsTo", "belongsToMany", "hasOne", "hasMany"]
    const associations: Record<string, IAssociation> = {}

    relationships.forEach((relationship) => {
      // For each relationship type, check if we have definitions for it:
      if (model[relationship]) {
        // Grab the array of targets and options
        model[relationship].forEach(({ target, options }) => {
          if (!target || !sequelize.models[target]) {
            throw new HatchifyError({
              title:
                "Unknown Model association for " +
                model.name +
                " in " +
                relationship,
              status: statusCodes.CONFLICT,
              code: codes.ERR_CONFLICT,
            })
          }

          // Pull the models off sequelize.models
          const current = sequelize.models[model.name]
          const associated = sequelize.models[target]

          // Create the relationship
          current[relationship](associated, options)

          //Get association name for lookup
          let associationName = options.as
          if (!associationName) {
            associationName = target.toLowerCase()
            if (relationship !== "hasOne" && relationship !== "belongsTo") {
              associationName = inflection.pluralize("target") // TODO: what is happening here?
            }
          }

          // Add association details to a lookup for each model
          const modelAssociation = {
            type: relationship,
            model: target,
            key: options.foreignKey ?? `${target.toLowerCase()}_id`,
            joinTable:
              relationship === "belongsToMany"
                ? typeof options.through === "string"
                  ? options.through
                  : options.through.model
                : undefined,
          }
          associationsLookup[model.name] = {
            ...associationsLookup[model.name],
            [associationName]: modelAssociation,
          }
          associations[associationName] = modelAssociation
        })
      }
    })
    // Create the serializer schema for the model
    registerSchema(serializer, model, associations, primaryKeys[model.name])
  })

  return {
    associationsLookup,
    models: sequelize.models as SequelizeModelsCollection,
    virtuals,
  }
}

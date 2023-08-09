import querystringParser from "@bitovi/sequelize-querystring-parser"
import { extendSequelize } from "@hatchifyjs/sequelize-create-with-associations"
import type {
  IAssociation,
  ICreateHatchifyModel,
} from "@hatchifyjs/sequelize-create-with-associations"
import { camelCase } from "camel-case"
import * as inflection from "inflection"
import type JSONAPISerializer from "json-api-serializer"
import { snakeCase } from "lodash"
import type {
  DataType,
  Model,
  ModelAttributeColumnOptions,
  Options,
} from "sequelize"
import { DataTypes, Sequelize } from "sequelize"

import { HatchifyError, codes, statusCodes } from "../error"
import { registerSchema } from "../serialize"
import type {
  HatchifyModel,
  HatchifyModelCollection,
  SequelizeModelsCollection,
  Virtuals,
} from "../types"
import { HatchifySymbolModel } from "../types"

export function buildHatchifyModelObject(
  models: SequelizeModelsCollection,
): HatchifyModelCollection {
  return Object.entries(models).reduce(
    (acc, [name, model]) => ({ ...acc, [name]: model[HatchifySymbolModel] }),
    {},
  )
}

export function createSequelizeInstance(
  options: Options = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
): Sequelize {
  extendSequelize(Sequelize)

  return new Sequelize(options)
}

type Attribute<M extends Model = Model> = ModelAttributeColumnOptions<M> & {
  include?: any
}

function getAttributeAsObject<M extends Model = Model>(
  attribute: string | DataType | Attribute<M>,
): Attribute<M> {
  if (typeof attribute === "string") {
    return { type: DataTypes[attribute] }
  }

  if (typeof attribute === "function") {
    return { type: attribute }
  }

  if ("type" in attribute) {
    if (typeof attribute.type === "string") {
      return { ...attribute, type: DataTypes[attribute.type] }
    }

    return attribute
  }

  throw new Error("Unexpected type")
}

export function parseAttribute<M extends Model = Model>(
  attribute: string | DataType | Attribute<M>,
): Attribute<M> {
  const attributeObjectType = getAttributeAsObject(attribute)

  if (attributeObjectType.type.toString({}) === "ENUM") {
    return {
      ...attributeObjectType,
      validate: {
        ...(attributeObjectType.validate || {}),
        isIn: [attributeObjectType.values as string[]],
      },
    }
  }

  return attributeObjectType
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
        if (virtuals[model.name]) {
          virtuals[model.name][attributeKey] = updatedInclude || []
        } else {
          virtuals[model.name] = {
            [attributeKey]: updatedInclude || [],
          }
        }

        include && delete attribute.include
      }

      model.attributes[attributeKey] = parsedAttribute
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
        tableName: snakeCase(model.name),
      },
    )

    // GET THE PRIMARY KEY
    primaryKeys[model.name] = temp.primaryKeyAttribute

    temp[HatchifySymbolModel] = model
  })

  const associationsLookup: Record<string, Record<string, IAssociation>> = {}

  models.forEach((model) => {
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
                  model.name +
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
                ? inflection.pluralize(target)
                : target,
            )

          // Pull the models off sequelize.models
          const current = sequelize.models[model.name]
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

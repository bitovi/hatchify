import { assembler } from "@hatchifyjs/hatchify-core"
import type { PartialSchema } from "@hatchifyjs/hatchify-core"
import type { ICreateHatchifyModel } from "@hatchifyjs/sequelize-create-with-associations"
import type JSONAPISerializer from "json-api-serializer"
import type { Sequelize } from "sequelize"

import { toSequelize } from "./toSequelize"
import { registerSchema } from "../../serialize"
import { HatchifySymbolModel } from "../../types"
import type { HatchifyModel, SequelizeModelsCollection } from "../../types"

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
    }

    sequelize.models[schema.name][HatchifySymbolModel] = model

    return model
  })

  // Create the serializer schema for the model
  hatchifyModels.forEach((model) => registerSchema(serializer, model, {}, "id"))

  return {
    associationsLookup: {},
    models: sequelize.models as SequelizeModelsCollection,
    virtuals: {},
  }
}

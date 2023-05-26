import type { Model } from "sequelize"
import type { Hatchify } from "../koa"

import type JSONAPISerializer from "json-api-serializer"
import type { JSONAPIDocument } from "json-api-serializer"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations"
import type { HatchifyModel } from "../types"

/**
 * Provides a set of exported functions, per Model, that
 * takes data, usually some database/model record, and
 * converts it into JSON:API response format
 */
export interface SerializeFunctions<
  T extends Model<any, any> = Model<any, any>,
> {
  /**
   * Takes a Model instance and converts it into a
   * JSON:API serialized response that can be returned
   * to the caller
   *
   * In most normal use cases this can come directly from the
   * output of a Model query operation.
   *
   * @returns {JSONAPIDocument}
   */
  findAll: (data: T[], attributes) => Promise<JSONAPIDocument>
  findOne: (data: T, attributes) => Promise<JSONAPIDocument>
  findAndCountAll: (
    data: {
      rows: T[]
      count: number
    },
    attributes,
  ) => Promise<JSONAPIDocument>
  create: (data: T) => Promise<JSONAPIDocument>
  update: (rowCount: number) => Promise<JSONAPIDocument>
  destroy: (rowCount: number) => Promise<JSONAPIDocument>
}

async function findAllImpl(
  hatchify: Hatchify,
  name: string,
  array,
  attributes,
) {
  const virtualsForModel = hatchify.virtuals[name]

  if (virtualsForModel) {
    return serializeWithoutUnsolicitedVirtuals(
      hatchify,
      array,
      name,
      attributes,
      Object.keys(hatchify.virtuals[name]),
    )
  }

  return hatchify.serializer.serialize(name, array)
}

async function findOneImpl(
  hatchify: Hatchify,
  name: string,
  instance,
  attributes,
) {
  const virtualsForModel = hatchify.virtuals[name]

  if (virtualsForModel) {
    return serializeWithoutUnsolicitedVirtuals(
      hatchify,
      instance,
      name,
      attributes,
      Object.keys(hatchify.virtuals[name]),
    )
  }
  return hatchify.serializer.serialize(name, instance)
}

async function findAndCountAllImpl(
  hatchify: Hatchify,
  name: string,
  result,
  attributes,
) {
  const virtualsForModel = hatchify.virtuals[name]

  if (virtualsForModel) {
    return serializeWithoutUnsolicitedVirtuals(
      hatchify,
      result.rows,
      name,
      attributes,
      Object.keys(hatchify.virtuals[name]),
    )
  }

  return hatchify.serializer.serialize(name, result.rows)
}

async function createImpl(hatchify: Hatchify, name: string, instance) {
  return hatchify.serializer.serialize(name, instance)
}

async function destroyImpl(hatchify: Hatchify, name: string, rowCount) {
  return hatchify.serializer.serialize(name, null, { count: rowCount })
}

async function updateImpl(hatchify: Hatchify, name: string, rowCount) {
  return hatchify.serializer.serialize(name, null, { count: rowCount })
}

// export function buildSerializerForModelStandalone(
//     serializer: JSONAPISerializer,
//     model: HatchifyModel
// ): SerializeFunctions {
//   return {
//     findAll: async (array) => findAllImpl(model.name, array),
//     findOne: async (instance) =>
//       findOneImpl(model.name, instance),
//     findAndCountAll: async (result) =>
//       findAndCountAllImpl(model.name, result),
//     create: async (instance) =>
//       createImpl(model.name, instance),
//     destroy: async (rowCount) =>
//       destroyImpl(model.name, rowCount),
//     update: async (rowCount) =>
//       updateImpl(model.name, rowCount),
//     error: (options: JSONAPIErrorOptions) => {
//       throw new Error(options.title);
//     },
//   };
// }

export function buildSerializerForModel(
  hatchify: Hatchify,
  modelName: string,
): SerializeFunctions {
  return {
    findAll: async (array, attributes) =>
      findAllImpl(hatchify, modelName, array, attributes),
    findOne: async (instance, attributes) =>
      findOneImpl(hatchify, modelName, instance, attributes),
    findAndCountAll: async (result, attributes) =>
      findAndCountAllImpl(hatchify, modelName, result, attributes),
    create: async (instance) => createImpl(hatchify, modelName, instance),
    destroy: async (rowCount) => destroyImpl(hatchify, modelName, rowCount),
    update: async (rowCount) => updateImpl(hatchify, modelName, rowCount),
  }
}

const deserialize = (data: any) => {
  if (data) {
    const { id } = data
    return { id }
  }
  return data
}

export function registerSchema(
  serializer: JSONAPISerializer,
  model: HatchifyModel,
  associations: Record<string, IAssociation>,
  primaryKey: string,
) {
  const relationships: { [key: string]: any } = {}
  const associationsKeys = Object.keys(associations)
  associationsKeys.forEach((associationsKey) => {
    const association = associations[associationsKey]
    relationships[associationsKey] = {
      type: association.model,
      deserialize,
    }
  })
  serializer.register(model.name, {
    id: primaryKey,
    whitelist: Object.keys(model.attributes),
    relationships,
  })
}

const serializeWithoutUnsolicitedVirtuals = (
  hatchify,
  array,
  name,
  attributes,
  virtualsForModel,
) => {
  const blackListArray = attributes
    ? virtualsForModel.filter((virtual) => !attributes.includes(virtual))
    : virtualsForModel

  return hatchify.serializer.serialize(
    name,
    array,
    "default",
    undefined,
    undefined,
    {
      [name]: {
        blacklist: blackListArray,
      },
    },
  )
}

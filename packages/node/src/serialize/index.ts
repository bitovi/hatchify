import type { FinalSchema } from "@hatchifyjs/core"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations/dist/sequelize/types"
import type JSONAPISerializer from "json-api-serializer"
import type { JSONAPIDocument } from "json-api-serializer"
import type { Model } from "sequelize"

import type { Hatchify } from "../node"
import { getFullModelName } from "../utils/getFullModelName"

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
  findAll: (data: T[], attributes: any) => Promise<JSONAPIDocument>
  findOne: (data: T, attributes: any) => Promise<JSONAPIDocument>
  findAndCountAll: (
    data: {
      rows: T[]
      count: number
    },
    attributes: any,
  ) => Promise<JSONAPIDocument>
  create: (data: T) => Promise<JSONAPIDocument>
  update: (rowCount: number) => Promise<JSONAPIDocument>
  destroy: (rowCount: number) => Promise<JSONAPIDocument>
}

async function findAllImpl(
  hatchify: Hatchify,
  name: string,
  array: any[],
  attributes: any,
) {
  if (hatchify.virtuals[name]) {
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
  instance: any,
  attributes: any,
) {
  if (hatchify.virtuals[name]) {
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
  result: any,
  attributes: any,
) {
  if (hatchify.virtuals[name]) {
    return serializeWithoutUnsolicitedVirtuals(
      hatchify,
      result.rows,
      name,
      attributes,
      Object.keys(hatchify.virtuals[name]),
    )
  }

  return hatchify.serializer.serialize(name, result.rows, {
    unpaginatedCount: result.count,
  })
}

async function createImpl(hatchify: Hatchify, name: string, instance: any) {
  return hatchify.serializer.serialize(name, instance)
}

async function destroyImpl(hatchify: Hatchify, name: string, rowCount: number) {
  return hatchify.serializer.serialize(name, null, { count: rowCount })
}

async function updateImpl(hatchify: Hatchify, name: string, rowCount: number) {
  return hatchify.serializer.serialize(name, null, { count: rowCount })
}

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

export function registerSchema(
  serializer: JSONAPISerializer,
  model: FinalSchema,
  associations: Record<string, IAssociation>,
  primaryKey: string,
): void {
  serializer.register(getFullModelName(model), {
    id: primaryKey,
    whitelist: Object.keys(model.attributes),
    relationships: Object.entries(associations).reduce(
      (acc, [associationName, { model }]) => ({
        ...acc,
        [associationName]: {
          type: model,
          deserialize: (data: { id: any } | null | undefined) =>
            data
              ? {
                  // Numeric IDs are passed as strings in JSON:API
                  id: isNaN(data.id) ? data.id : +data.id,
                }
              : data,
        },
      }),
      {},
    ),
    topLevelMeta: (
      _data: any,
      { unpaginatedCount }: { unpaginatedCount: any },
    ) =>
      unpaginatedCount != null
        ? {
            unpaginatedCount,
          }
        : undefined,
  })
}

const serializeWithoutUnsolicitedVirtuals = (
  hatchify: Hatchify,
  array: any[],
  name: string,
  attributes: any[],
  virtualsForModel: any[],
) => {
  return hatchify.serializer.serialize(
    name,
    array,
    "default",
    undefined,
    undefined,
    {
      [name]: {
        blacklist: attributes
          ? virtualsForModel.filter((virtual) => !attributes.includes(virtual))
          : virtualsForModel,
      },
    },
  )
}

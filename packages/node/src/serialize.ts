import { getSchemaKey } from "@hatchifyjs/core"
import type { FinalSchema } from "@hatchifyjs/core"
import type { IAssociation } from "@hatchifyjs/sequelize-create-with-associations/dist/sequelize/types"
import type JSONAPISerializer from "json-api-serializer"
import type { JSONAPIDocument } from "json-api-serializer"
import type { Model } from "sequelize"

import type { Hatchify } from "./node.js"

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
  update: (instance: T, rowCount: number) => Promise<JSONAPIDocument>
  destroy: (rowCount: number) => Promise<JSONAPIDocument>
}

async function findAllImpl(
  hatchify: Hatchify,
  schemaName: string,
  array: any[],
) {
  return hatchify.serializer.serialize(schemaName, array)
}

async function findOneImpl(
  hatchify: Hatchify,
  schemaName: string,
  instance: any,
) {
  return hatchify.serializer.serialize(schemaName, instance)
}

async function findAndCountAllImpl(
  hatchify: Hatchify,
  schemeName: string,
  result: any,
) {
  return hatchify.serializer.serialize(schemeName, result.rows, {
    unpaginatedCount: result.count,
  })
}

async function createImpl(
  hatchify: Hatchify,
  schemaName: string,
  instance: any,
) {
  return hatchify.serializer.serialize(schemaName, instance)
}

async function destroyImpl(
  hatchify: Hatchify,
  schemaName: string,
  rowCount: number,
) {
  return hatchify.serializer.serialize(schemaName, null, { count: rowCount })
}

async function updateImpl(
  hatchify: Hatchify,
  schemaName: string,
  instance: any,
  rowCount: number,
) {
  return hatchify.serializer.serialize(schemaName, instance, {
    count: rowCount,
  })
}

export function buildSerializerForModel(
  hatchify: Hatchify,
  schemaName: string,
): SerializeFunctions {
  return {
    findAll: async (array) => findAllImpl(hatchify, schemaName, array),
    findOne: async (instance) => findOneImpl(hatchify, schemaName, instance),
    findAndCountAll: async (result) =>
      findAndCountAllImpl(hatchify, schemaName, result),
    create: async (instance) => createImpl(hatchify, schemaName, instance),
    destroy: async (rowCount) => destroyImpl(hatchify, schemaName, rowCount),
    update: async (instance, rowCount) =>
      updateImpl(hatchify, schemaName, instance, rowCount),
  }
}

export function registerSchema(
  serializer: JSONAPISerializer,
  model: FinalSchema,
  associations: Record<string, IAssociation>,
  primaryKey: string,
): void {
  serializer.register(getSchemaKey(model), {
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

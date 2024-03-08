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
  findAll: (instances: T[]) => JSONAPIDocument
  findOne: (instance: T) => JSONAPIDocument
  findAndCountAll: (data: { rows: T[]; count: number }) => JSONAPIDocument
  create: (instance: T) => JSONAPIDocument
  update: (instance: T, count: number) => JSONAPIDocument
  destroy: () => JSONAPIDocument
}

export function buildSerializerForModel(
  hatchify: Hatchify,
  schemaName: string,
): SerializeFunctions {
  return {
    findAll: (instances) =>
      hatchify.serializer.serialize(schemaName, instances),
    findOne: (instance) => hatchify.serializer.serialize(schemaName, instance),
    findAndCountAll: ({ rows, count: unpaginatedCount }) =>
      hatchify.serializer.serialize(schemaName, rows, { unpaginatedCount }),
    create: (instance) => hatchify.serializer.serialize(schemaName, instance),
    update: (instance, count) =>
      hatchify.serializer.serialize(schemaName, instance, { count }),
    destroy: () => hatchify.serializer.serialize(schemaName, null),
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
      _data: JSONAPIDocument,
      { unpaginatedCount }: { unpaginatedCount: number },
    ) =>
      unpaginatedCount != null
        ? {
            unpaginatedCount,
          }
        : undefined,
  })
}

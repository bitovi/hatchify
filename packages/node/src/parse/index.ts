import { getSchemaKey } from "@hatchifyjs/core"
import type { FinalSchema } from "@hatchifyjs/core"
import type { JSONAPIDocument } from "json-api-serializer"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
} from "sequelize"

import { buildFindOptions } from "./builder.js"
import { validateFindOptions, validateStructure } from "./validator.js"
import type { Hatchify } from "../node.js"
import type { JSONObject } from "../types.js"

/**
 * Provides a set of exported functions, per Model, that
 * take information from the URL and parse it into a valid
 * Query options object
 */
export interface ParseFunctions {
  /**
   * Parses the parameters for the provided Model to prepare
   * the options needed for an ORM findAll query
   *
   * In most normal use cases this can come directly from the
   * Koa Context as `ctx.querystring`
   *
   */
  findAll: (querystring: string) => FindOptions
  findOne: (querystring: string, id: Identifier) => FindOptions
  findAndCountAll: (querystring: string) => FindOptions
  create: (
    body: JSONAPIDocument,
  ) => Promise<{ body: JSONObject; ops: CreateOptions }>
  update: (
    body: JSONAPIDocument,
    id: Identifier,
  ) => Promise<{ body: JSONObject; ops: UpdateOptions }>
  destroy: (id: Identifier) => DestroyOptions
}

function restoreId(targetKey: string, { id, ...rest }: any) {
  return { ...rest, [targetKey]: id }
}

export function restoreIds<T extends FinalSchema = FinalSchema>(
  schema: T,
  parsedBody: any,
): any {
  return Object.entries(schema.relationships ?? {}).reduce(
    (acc, [relationshipName, relationship]) => {
      if (
        "targetKey" in relationship &&
        relationship.targetKey &&
        relationship.targetKey !== "id"
      ) {
        if (Array.isArray(acc[relationshipName])) {
          return {
            ...acc,
            [relationshipName]: acc[relationshipName].map((value: any) =>
              restoreId(relationship.targetKey as string, value),
            ),
          }
        }

        if (acc[relationshipName].id) {
          return {
            ...acc,
            [relationshipName]: restoreId(
              relationship.targetKey,
              acc[relationshipName],
            ),
          }
        }
      }

      return acc
    },
    parsedBody,
  )
}

export function buildParserForModelStandalone(
  hatchify: Hatchify,
  schema: FinalSchema,
): ParseFunctions {
  return {
    findAll: (querystring) => {
      {
        const { data, errors } = buildFindOptions(hatchify, schema, querystring)
        if (errors.length) {
          throw errors
        }
        validateFindOptions(data, schema, hatchify)
        return data
      }
    },
    findOne: (querystring, id) => {
      const { data, errors } = buildFindOptions(
        hatchify,
        schema,
        querystring,
        id,
      )
      if (errors.length) {
        throw errors
      }
      validateFindOptions(data, schema, hatchify)
      return data
    },
    findAndCountAll: (querystring) => {
      const { data, errors } = buildFindOptions(hatchify, schema, querystring)
      if (errors.length) {
        throw errors
      }
      validateFindOptions(data, schema, hatchify)
      return data
    },
    create: async (body) => {
      validateStructure(body, schema, hatchify)
      const parsedBody = await hatchify.serializer.deserialize(
        getSchemaKey(schema),
        body,
      )

      return {
        body: restoreIds(schema, parsedBody),
        ops: {},
      }
    },
    update: async (body, id) => {
      validateStructure(body, schema, hatchify)
      const parsedBody = await hatchify.serializer.deserialize(
        getSchemaKey(schema),
        body,
      )

      return {
        body: restoreIds(schema, parsedBody),
        ops: { where: id ? { id } : {} },
      }
    },
    destroy: (id) => ({ where: { id } }),
  }
}

export function buildParserForModel(
  hatchify: Hatchify,
  schemaName: string,
): ParseFunctions {
  return buildParserForModelStandalone(hatchify, hatchify.schema[schemaName])
}

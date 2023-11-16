import { getSchemaKey } from "@hatchifyjs/core"
import type { FinalSchema } from "@hatchifyjs/core"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
} from "sequelize"

import { buildDestroyOptions, buildFindOptions } from "./builder"
import { validateFindOptions, validateStructure } from "./validator"
import type { Hatchify } from "../node"
import type { JSONObject } from "../types"

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
  findAll: (querystring: string) => Promise<FindOptions>
  findOne: (querystring: string, id: Identifier) => Promise<FindOptions>
  findAndCountAll: (querystring: string) => Promise<FindOptions>
  create: (body: unknown) => Promise<{ body: JSONObject; ops: CreateOptions }>
  update: (
    body: unknown,
    id?: Identifier,
  ) => Promise<{ body: JSONObject; ops: UpdateOptions }>
  destroy: (querystring: string, id?: Identifier) => Promise<DestroyOptions>
}

async function findAllImpl(
  hatchify: Hatchify,
  schema: FinalSchema,
  querystring: string,
) {
  const { data, errors } = buildFindOptions(hatchify, schema, querystring)
  if (errors.length) {
    throw errors
  }
  validateFindOptions(data, schema, hatchify)
  return data
}

async function findOneImpl(
  hatchify: Hatchify,
  schema: FinalSchema,
  querystring: string,
  id: Identifier,
) {
  const { data, errors } = buildFindOptions(hatchify, schema, querystring, id)
  if (errors.length) {
    throw errors
  }
  validateFindOptions(data, schema, hatchify)
  return data
}

async function findAndCountAllImpl(
  hatchify: Hatchify,
  schema: FinalSchema,
  querystring: string,
) {
  const { data, errors } = buildFindOptions(hatchify, schema, querystring)
  if (errors.length) {
    throw errors
  }
  validateFindOptions(data, schema, hatchify)
  return data
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

async function createImpl<T extends FinalSchema = FinalSchema>(
  hatchify: Hatchify,
  schema: T,
  body: any,
) {
  validateStructure(body, schema, hatchify)
  const parsedBody = await hatchify.serializer.deserialize(
    getSchemaKey(schema),
    body,
  )

  return {
    body: restoreIds(schema, parsedBody),
    ops: {},
  }
}

async function updateImpl(
  hatchify: Hatchify,
  schema: FinalSchema,
  body: any,
  id?: Identifier,
) {
  validateStructure(body, schema, hatchify)
  const parsedBody = await hatchify.serializer.deserialize(
    getSchemaKey(schema),
    body,
  )

  return {
    body: restoreIds(schema, parsedBody),
    ops: { where: id ? { id } : {} },
  }
}

async function destroyImpl(querystring: string, id?: Identifier) {
  const { data, errors } = buildDestroyOptions(querystring, id)
  if (errors.length) {
    throw errors
  }
  return data
}

export function buildParserForModelStandalone(
  hatchify: Hatchify,
  schema: FinalSchema,
): ParseFunctions {
  return {
    findAll: async (querystring) => findAllImpl(hatchify, schema, querystring),
    findOne: async (querystring, id) =>
      findOneImpl(hatchify, schema, querystring, id),
    findAndCountAll: async (querystring) =>
      findAndCountAllImpl(hatchify, schema, querystring),
    create: async (body) => createImpl(hatchify, schema, body),
    destroy: async (querystring, id) => destroyImpl(querystring, id),
    update: async (body, id) => updateImpl(hatchify, schema, body, id),
  }
}

export function buildParserForModel(
  hatchify: Hatchify,
  schemaName: string,
): ParseFunctions {
  return buildParserForModelStandalone(hatchify, hatchify.schema[schemaName])
}

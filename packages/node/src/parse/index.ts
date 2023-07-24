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
import type { HatchifyModel, JSONObject } from "../types"

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
  model: HatchifyModel,
  querystring: string,
) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length) throw errors
  validateFindOptions(data, model, hatchify)
  return data
}

async function findOneImpl(
  hatchify: Hatchify,
  model: HatchifyModel,
  querystring: string,
  id,
) {
  const { data, errors } = buildFindOptions(model, querystring, id)
  if (errors.length) throw errors
  validateFindOptions(data, model, hatchify)
  return data
}

async function findAndCountAllImpl(
  hatchify: Hatchify,
  model: HatchifyModel,
  querystring: string,
) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length) throw errors
  validateFindOptions(data, model, hatchify)
  return data
}

async function createImpl<T extends HatchifyModel = HatchifyModel>(
  hatchify: Hatchify,
  model: T,
  body: any,
) {
  validateStructure(body, model, hatchify)
  const parsedBody = await hatchify.serializer.deserialize(model.name, body)

  return {
    body: parsedBody,
    ops: {},
  }
}

async function updateImpl(
  hatchify: Hatchify,
  model: HatchifyModel,
  body: any,
  id,
) {
  validateStructure(body, model, hatchify)
  const parsedBody = await hatchify.serializer.deserialize(model.name, body)

  return {
    body: parsedBody,
    ops: { where: id ? { id } : {} },
  }
}

async function destroyImpl(querystring: string, id?: Identifier) {
  const { data, errors } = buildDestroyOptions(querystring, id)
  if (errors.length) throw errors
  return data
}

export function buildParserForModelStandalone(
  hatchify: Hatchify,
  model: HatchifyModel,
): ParseFunctions {
  return {
    findAll: async (querystring) => findAllImpl(hatchify, model, querystring),
    findOne: async (querystring, id) =>
      findOneImpl(hatchify, model, querystring, id),
    findAndCountAll: async (querystring) =>
      findAndCountAllImpl(hatchify, model, querystring),
    create: async (body) => createImpl(hatchify, model, body),
    destroy: async (querystring, id) => destroyImpl(querystring, id),
    update: async (body, id) => updateImpl(hatchify, model, body, id),
  }
}

export function buildParserForModel(
  hatchify: Hatchify,
  modelName: string,
): ParseFunctions {
  return buildParserForModelStandalone(hatchify, hatchify.models[modelName])
}

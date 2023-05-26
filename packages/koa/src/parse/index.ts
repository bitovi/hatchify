import type {
  DestroyOptions,
  UpdateOptions,
  Identifier,
  CreateOptions,
  FindOptions,
} from "sequelize"
import type { Hatchify } from ".."
import {
  buildCreateOptions,
  buildDestroyOptions,
  buildFindOptions,
  buildUpdateOptions,
} from "./builder"
import type { JSONObject, HatchifyModel } from "../types"
import { ValidationError } from "../error/errors"
import { codes, statusCodes } from "../error/constants"

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

async function findAllImpl(model: HatchifyModel, querystring: string) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }
  return data
}

async function findOneImpl(model: HatchifyModel, querystring: string, id) {
  const { data, errors } = buildFindOptions(model, querystring, id)
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }
  return data
}

async function findAndCountAllImpl(model: HatchifyModel, querystring: string) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }
  return data
}

async function createImpl<T extends HatchifyModel = HatchifyModel>(
  hatchify: Hatchify,
  model: T,
  body: unknown,
) {
  const serializer = hatchify.serializer
  const { data, errors } = buildCreateOptions("")
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }
  const parsed = await serializer.deserialize(model.name, body as any)
  // FOR NON-JSON Compliant, it returns an empty object
  const parsedBody = Object.keys(parsed).length === 0 ? body : parsed

  return {
    body: parsedBody,
    ops: data,
  }
}

async function updateImpl(
  hatchify: Hatchify,
  model: HatchifyModel,
  body: unknown,
  id,
) {
  const serializer = hatchify.serializer
  const { data, errors } = buildUpdateOptions("", id)
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }

  const parsed = await serializer.deserialize(model.name, body as any)
  // FOR NON-JSON Compliant, it returns an empty object
  const parsedBody = Object.keys(parsed).length === 0 ? body : parsed

  return {
    body: parsedBody,
    ops: data,
  }
}

async function destroyImpl(model: HatchifyModel, querystring: string, id) {
  const { data, errors } = buildDestroyOptions(querystring, id)
  if (errors.length > 0) {
    throw new ValidationError({
      code: codes.ERR_INVALID_PARAMETER,
      status: statusCodes.UNPROCESSABLE_ENTITY,
      title: "Bad Request, Invalid Query String",
    })
  }

  return data
}

export function buildParserForModelStandalone(
  hatchify: Hatchify,
  model: HatchifyModel,
): ParseFunctions {
  return {
    findAll: async (querystring) => findAllImpl(model, querystring),
    findOne: async (querystring, id) => findOneImpl(model, querystring, id),
    findAndCountAll: async (querystring) =>
      findAndCountAllImpl(model, querystring),
    create: async (body) => createImpl(hatchify, model, body),
    destroy: async (querystring, id) => destroyImpl(model, querystring, id),
    update: async (body, id) => updateImpl(hatchify, model, body, id),
  }
}

export function buildParserForModel(
  hatchify: Hatchify,
  modelName: string,
): ParseFunctions {
  const model = hatchify.models[modelName]
  return buildParserForModelStandalone(hatchify, model)
}

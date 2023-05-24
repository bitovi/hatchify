/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import {
  DestroyOptions,
  UpdateOptions,
  Identifier,
  CreateOptions,
  FindOptions,
} from "sequelize"
import { Scaffold } from ".."
import {
  buildCreateOptions,
  buildDestroyOptions,
  buildFindOptions,
  buildUpdateOptions,
} from "./builder"
// import { buildDeserializerForModelStandalone } from "../deserialize";
import { JSONObject, ScaffoldModel } from "../types"
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
  create: <T extends ScaffoldModel = ScaffoldModel>(
    body: unknown,
  ) => Promise<{ body: JSONObject; ops: CreateOptions }>
  update: (
    body: unknown,
    id?: Identifier,
  ) => Promise<{ body: JSONObject; ops: UpdateOptions }>
  destroy: (querystring: string, id?: Identifier) => Promise<DestroyOptions>
}

async function findAllImpl(model: ScaffoldModel, querystring: string) {
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

async function findOneImpl(model: ScaffoldModel, querystring: string, id) {
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

async function findAndCountAllImpl(model: ScaffoldModel, querystring: string) {
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

async function createImpl<T extends ScaffoldModel = ScaffoldModel>(
  scaffold: Scaffold,
  model: T,
  body: unknown,
) {
  const serializer = scaffold.serializer
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
  scaffold: Scaffold,
  model: ScaffoldModel,
  body: unknown,
  id,
) {
  const serializer = scaffold.serializer
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

async function destroyImpl(model: ScaffoldModel, querystring: string, id) {
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
  scaffold: Scaffold,
  model: ScaffoldModel,
): ParseFunctions {
  return {
    findAll: async (querystring) => findAllImpl(model, querystring),
    findOne: async (querystring, id) => findOneImpl(model, querystring, id),
    findAndCountAll: async (querystring) =>
      findAndCountAllImpl(model, querystring),
    create: async (body) => createImpl(scaffold, model, body),
    destroy: async (querystring, id) => destroyImpl(model, querystring, id),
    update: async (body, id) => updateImpl(scaffold, model, body, id),
  }
}

export function buildParserForModel(
  scaffold: Scaffold,
  modelName: string,
): ParseFunctions {
  const model = scaffold.models[modelName]
  return buildParserForModelStandalone(scaffold, model)
}

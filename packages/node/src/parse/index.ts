import { capitalize, singularize } from "inflection"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
} from "sequelize"

import { buildDestroyOptions, buildFindOptions } from "./builder"
import {
  UnexpectedValueError,
  ValidationError,
  ValueRequiredError,
  codes,
  statusCodes,
} from "../error"
import type { HatchifyError } from "../error"
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

async function findAllImpl(model: HatchifyModel, querystring: string) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length > 0) {
    throw [
      new ValidationError({
        code: codes.ERR_INVALID_PARAMETER,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        title: "Bad Request, Invalid Query String",
      }),
    ]
  }
  return data
}

async function findOneImpl(model: HatchifyModel, querystring: string, id) {
  const { data, errors } = buildFindOptions(model, querystring, id)
  if (errors.length > 0) {
    throw [
      new ValidationError({
        code: codes.ERR_INVALID_PARAMETER,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        title: "Bad Request, Invalid Query String",
      }),
    ]
  }
  return data
}

async function findAndCountAllImpl(model: HatchifyModel, querystring: string) {
  const { data, errors } = buildFindOptions(model, querystring)
  if (errors.length > 0) {
    throw [
      new ValidationError({
        code: codes.ERR_INVALID_PARAMETER,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        title: "Bad Request, Invalid Query String",
      }),
    ]
  }
  return data
}

function validateStructure<T extends HatchifyModel = HatchifyModel>(
  body: any,
  model: T,
) {
  if (!body.data) {
    throw [
      new ValueRequiredError({
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'data'.",
        pointer: "/data",
      }),
    ]
  }

  if (!body.data.attributes) {
    throw [
      new ValueRequiredError({
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'attributes'.",
        pointer: "/data/attributes",
      }),
    ]
  }

  const errors = Object.entries(body.data.relationships || {}).reduce(
    (acc, [relationshipName, relationshipValue]: [string, any]) => {
      if (!relationshipValue) {
        return [
          ...acc,
          new ValueRequiredError({
            title: "Payload is missing a required value.",
            detail: `Payload must include a value for '${relationshipName}'.`,
            pointer: `/data/attributes/${relationshipName}`,
          }),
        ]
      }

      if (!relationshipValue.data) {
        return [
          ...acc,
          new ValueRequiredError({
            title: "Payload is missing a required value.",
            detail: `Payload must include a value for 'data'.`,
            pointer: `/data/attributes/${relationshipName}/data`,
          }),
        ]
      }

      const errors: HatchifyError[] = []

      const modelName = capitalize(singularize(relationshipName))

      const expectObject =
        model.hasOne?.some(({ target }) => target === modelName) ||
        model.belongsTo?.some(({ target }) => target === modelName)
      const expectArray =
        model.hasMany?.some(({ target }) => target === modelName) ||
        model.belongsToMany?.some(({ target }) => target === modelName)

      if (expectArray && !Array.isArray(relationshipValue.data)) {
        errors.push(
          new UnexpectedValueError({
            detail: `Payload must have 'data' as an array.`,
            pointer: `/data/relationships/${relationshipName}/data`,
          }),
        )
      }

      if (expectObject && Array.isArray(relationshipValue.data)) {
        errors.push(
          new UnexpectedValueError({
            detail: `Payload must have 'data' as an object.`,
            pointer: `/data/relationships/${relationshipName}/data`,
          }),
        )
      }

      return [...acc, ...errors]
    },
    [],
  )

  if (errors.length) throw errors
}

async function createImpl<T extends HatchifyModel = HatchifyModel>(
  hatchify: Hatchify,
  model: T,
  body: any,
) {
  validateStructure(body, model)
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
  validateStructure(body, model)
  const parsedBody = await hatchify.serializer.deserialize(model.name, body)

  return {
    body: parsedBody,
    ops: { where: id ? { id } : {} },
  }
}

async function destroyImpl(querystring: string, id?: Identifier) {
  const { data, errors } = buildDestroyOptions(querystring, id)
  if (errors.length > 0) {
    throw [
      new ValidationError({
        code: codes.ERR_INVALID_PARAMETER,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        title: "Bad Request, Invalid Query String",
      }),
    ]
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

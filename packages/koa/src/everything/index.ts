import type { Hatchify } from "../koa"
import type { Identifier } from "sequelize"
// import { JSONObject } from "../types";
import type { JSONAPIDocument } from "json-api-serializer"
// import { statusCodes } from "../error/constants";
import { NotFoundError } from "../error/errors"

export interface EverythingFunctions {
  findAll: (querystring: string) => Promise<JSONAPIDocument>
  findOne: (querystring: string, id: Identifier) => Promise<JSONAPIDocument>
  findAndCountAll: (query: string) => Promise<JSONAPIDocument>
  create: (body: unknown, querystring: string) => Promise<JSONAPIDocument>
  update: (
    body: unknown,
    querystring: string,
    id?: Identifier,
  ) => Promise<JSONAPIDocument>
  destroy: (querystring: string, id?: Identifier) => Promise<JSONAPIDocument>
}

export function buildEverythingForModel(
  hatchify: Hatchify,
  modelName: string,
): EverythingFunctions {
  return {
    findAll: findAllEverything(hatchify, modelName),
    findOne: findOneEverything(hatchify, modelName),
    findAndCountAll: findAndCountAllEverything(hatchify, modelName),
    create: createEverything(hatchify, modelName),
    destroy: destroyEverything(hatchify, modelName),
    update: updateEverything(hatchify, modelName),
  }
}

export function findAllEverything(hatchify: Hatchify, modelName: string) {
  return async function findAllImpl(querystring: string) {
    const params = await hatchify.parse[modelName].findAll(querystring)
    const result = await hatchify.model[modelName].findAll(params)
    const response = await hatchify.serialize[modelName].findAll(
      result,
      params.attributes,
    )

    return response
  }
}

export function findOneEverything(hatchify: Hatchify, modelName: string) {
  return async function findOneImpl(querystring: string, id: Identifier) {
    const params = await hatchify.parse[modelName].findOne(querystring, id)
    const result = await hatchify.model[modelName].findByPk(id, params)
    if (!result) {
      throw new NotFoundError({
        detail: modelName + " with id " + id + " was not found",
      })
    }
    const response = await hatchify.serialize[modelName].findOne(
      result,
      params.attributes,
    )
    return response
  }
}

export function findAndCountAllEverything(
  hatchify: Hatchify,
  modelName: string,
) {
  return async function findAndCountAllImpl(querystring: string) {
    const params = await hatchify.parse[modelName].findAndCountAll(querystring)
    const result = await hatchify.model[modelName].findAndCountAll(params)

    const response = await hatchify.serialize[modelName].findAndCountAll(
      result,
      params.attributes,
    )
    return response
  }
}

export function createEverything(hatchify: Hatchify, modelName: string) {
  return async function createImpl(rawbody: unknown) {
    const { body, ops } = await hatchify.parse[modelName].create(rawbody)
    const result = await hatchify.model[modelName].create(body, ops)
    const response = await hatchify.serialize[modelName].create(result)
    return response
  }
}

export function updateEverything(hatchify: Hatchify, modelName: string) {
  return async function updateImpl(
    rawbody: any,
    querystring: string,
    id?: Identifier,
  ) {
    const { body, ops } = await hatchify.parse[modelName].update(rawbody, id)
    const result = await hatchify.model[modelName].update(body, ops)
    const response = await hatchify.serialize[modelName].update(result[0])
    return response
  }
}

export function destroyEverything(hatchify: Hatchify, modelName: string) {
  return async function destroyImpl(querystring: string, id: Identifier) {
    const params = await hatchify.parse[modelName].destroy(querystring, id)
    const result = await hatchify.model[modelName].destroy(params)
    const response = await hatchify.serialize[modelName].destroy(result)
    return response
  }
}

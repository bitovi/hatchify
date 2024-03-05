import type { JSONAPIDocument } from "json-api-serializer"
import type { Identifier } from "sequelize"

import { NotFoundError } from "./error/index.js"
import type { Hatchify } from "./node.js"

export interface EverythingFunctions {
  findAll: (querystring: string) => Promise<JSONAPIDocument>
  findOne: (querystring: string, id: Identifier) => Promise<JSONAPIDocument>
  findAndCountAll: (query: string) => Promise<JSONAPIDocument>
  create: (
    body: JSONAPIDocument,
    querystring: string,
  ) => Promise<JSONAPIDocument>
  update: (body: JSONAPIDocument, id: Identifier) => Promise<JSONAPIDocument>
  destroy: (id: Identifier) => Promise<JSONAPIDocument>
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
  return async function findAllImpl(
    querystring: string,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[modelName].findAll(querystring)
    const result = await hatchify.orm.models[modelName].findAll(params)
    return hatchify.serialize[modelName].findAll(
      result.map((row) => row.get({ plain: true })),
      params.attributes,
    )
  }
}

export function findOneEverything(hatchify: Hatchify, modelName: string) {
  return async function findOneImpl(
    querystring: string,
    id: Identifier,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[modelName].findOne(querystring, id)
    const result = await hatchify.orm.models[modelName].findByPk(id, params)
    if (!result) {
      throw [
        new NotFoundError({
          detail: modelName + " with id " + id + " was not found",
        }),
      ]
    }
    return hatchify.serialize[modelName].findOne(result, params.attributes)
  }
}

export function findAndCountAllEverything(
  hatchify: Hatchify,
  modelName: string,
) {
  return async function findAndCountAllImpl(
    querystring: string,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[modelName].findAndCountAll(querystring)
    const result = await hatchify.orm.models[modelName].findAndCountAll(params)

    return hatchify.serialize[modelName].findAndCountAll(
      { ...result, rows: result.rows.map((row) => row.get({ plain: true })) },
      params.attributes,
    )
  }
}

export function createEverything(hatchify: Hatchify, modelName: string) {
  return async function createImpl(
    rawbody: JSONAPIDocument,
  ): Promise<JSONAPIDocument> {
    const { body, ops } = hatchify.parse[modelName].create(rawbody)
    const result = await hatchify.orm.models[modelName].create(body, ops)
    return hatchify.serialize[modelName].create(result.get({ plain: true }))
  }
}

export function updateEverything(hatchify: Hatchify, modelName: string) {
  return async function updateImpl(
    rawbody: JSONAPIDocument,
    id: Identifier,
  ): Promise<JSONAPIDocument> {
    const { body, ops } = hatchify.parse[modelName].update(rawbody, id)
    const [affectedCount] = await hatchify.orm.models[modelName].update(
      body,
      ops,
    )
    if (!affectedCount) {
      throw [
        new NotFoundError({
          detail: `URL must include an ID of an existing '${modelName}'.`,
          parameter: "id",
        }),
      ]
    }
    const updated = await hatchify.orm.models[modelName].findByPk(id)
    return hatchify.serialize[modelName].update(
      updated?.get({ plain: true }),
      affectedCount,
    )
  }
}

export function destroyEverything(hatchify: Hatchify, modelName: string) {
  return async function destroyImpl(id: Identifier): Promise<JSONAPIDocument> {
    const params = hatchify.parse[modelName].destroy(id)
    const affectedCount = await hatchify.orm.models[modelName].destroy(params)
    if (!affectedCount) {
      throw [
        new NotFoundError({
          detail: `URL must include an ID of an existing '${modelName}'.`,
          parameter: "id",
        }),
      ]
    }
    return hatchify.serialize[modelName].destroy(affectedCount)
  }
}

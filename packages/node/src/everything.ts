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
  schemaName: string,
): EverythingFunctions {
  return {
    findAll: findAllEverything(hatchify, schemaName),
    findOne: findOneEverything(hatchify, schemaName),
    findAndCountAll: findAndCountAllEverything(hatchify, schemaName),
    create: createEverything(hatchify, schemaName),
    destroy: destroyEverything(hatchify, schemaName),
    update: updateEverything(hatchify, schemaName),
  }
}

export function findAllEverything(hatchify: Hatchify, schemaName: string) {
  return async function findAllImpl(
    querystring: string,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[schemaName].findAll(querystring)
    const result = await hatchify.orm.models[schemaName].findAll(params)
    return hatchify.serialize[schemaName].findAll(
      result.map((row) => row.get({ plain: true })),
    )
  }
}

export function findOneEverything(hatchify: Hatchify, schemaName: string) {
  return async function findOneImpl(
    querystring: string,
    id: Identifier,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[schemaName].findOne(querystring, id)
    const result = await hatchify.orm.models[schemaName].findByPk(id, params)
    if (!result) {
      throw [
        new NotFoundError({
          detail: schemaName + " with id " + id + " was not found",
        }),
      ]
    }
    return hatchify.serialize[schemaName].findOne(result)
  }
}

export function findAndCountAllEverything(
  hatchify: Hatchify,
  schemaName: string,
) {
  return async function findAndCountAllImpl(
    querystring: string,
  ): Promise<JSONAPIDocument> {
    const params = hatchify.parse[schemaName].findAndCountAll(querystring)
    const result = await hatchify.orm.models[schemaName].findAndCountAll(params)

    return hatchify.serialize[schemaName].findAndCountAll({
      ...result,
      rows: result.rows.map((row) => row.get({ plain: true })),
    })
  }
}

export function createEverything(hatchify: Hatchify, schemaName: string) {
  return async function createImpl(
    rawbody: JSONAPIDocument,
  ): Promise<JSONAPIDocument> {
    const { body, ops } = hatchify.parse[schemaName].create(rawbody)
    const result = await hatchify.orm.models[schemaName].create(body, ops)
    return hatchify.serialize[schemaName].create(result.get({ plain: true }))
  }
}

export function updateEverything(hatchify: Hatchify, schemaName: string) {
  return async function updateImpl(
    rawbody: JSONAPIDocument,
    id: Identifier,
  ): Promise<JSONAPIDocument> {
    const { body, ops } = hatchify.parse[schemaName].update(rawbody, id)
    const [affectedCount] = await hatchify.orm.models[schemaName].update(
      body,
      ops,
    )
    if (!affectedCount) {
      throw [
        new NotFoundError({
          detail: `URL must include an ID of an existing '${schemaName}'.`,
          parameter: "id",
        }),
      ]
    }
    const updated = await hatchify.orm.models[schemaName].findByPk(id)
    return hatchify.serialize[schemaName].update(updated?.get({ plain: true }))
  }
}

export function destroyEverything(hatchify: Hatchify, schemaName: string) {
  return async function destroyImpl(id: Identifier): Promise<JSONAPIDocument> {
    const params = hatchify.parse[schemaName].destroy(id)
    const affectedCount = await hatchify.orm.models[schemaName].destroy(params)
    if (!affectedCount) {
      throw [
        new NotFoundError({
          detail: `URL must include an ID of an existing '${schemaName}'.`,
          parameter: "id",
        }),
      ]
    }
    return hatchify.serialize[schemaName].destroy()
  }
}

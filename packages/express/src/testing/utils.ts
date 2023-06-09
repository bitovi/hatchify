import type { HatchifyModel } from "@hatchifyjs/node"
import { HatchifyError, codes, statusCodes } from "@hatchifyjs/node"
import Express from "express"
import type { NextFunction, Request, Response } from "express"
import { Deserializer } from "jsonapi-serializer"
import request from "supertest"

import { Hatchify, errorHandlerMiddleware } from "../express"

type Method = "get" | "post" | "patch" | "delete"
type Middleware = (req: Request, res: Response, next: NextFunction) => void

export async function startServerWith(
  models: HatchifyModel[],
  middleware?: Middleware[],
): Promise<{
  fetch: (
    path: string,
    options?: { method?: Method; headers?: object; body: object },
  ) => Promise<any>
  teardown: () => Promise<void>
}> {
  const app = Express()
  const hatchify = new Hatchify(models, { prefix: "/api" })
  app.use(errorHandlerMiddleware)
  app.use(hatchify.middleware.allModels.all)

  const server = app
  await hatchify.createDatabase()

  async function fetch(
    path: string,
    options?: { method?: Method; headers?: object; body: object },
  ) {
    const method = options?.method || "get"
    const headers = options?.headers || {}
    const body = options?.body
    const response = request(server)[method](path)

    Object.entries(headers).forEach(([key, value]) => response.set(key, value))

    if (body) {
      response.send(body)
    }
    return response
  }

  return {
    fetch,
    teardown: async () => hatchify.orm.close(),
  }
}

async function parse(result) {
  let serialized
  let deserialized
  let text
  let status

  if (!result) {
    throw new HatchifyError({
      title: "Invalid Result",
      code: codes.ERR_INVALID_RESULT,
      status: statusCodes.UNPROCESSABLE_ENTITY,
    })
  }

  if (result.statusCode) {
    status = result.statusCode
  }

  if (result.text) {
    text = result.text

    try {
      serialized = JSON.parse(result.text)
    } catch (err) {
      // do nothing, its just not JSON probably
    }

    try {
      const deserializer = new Deserializer({ keyForAttribute: "snake_case" })
      deserialized = await deserializer.deserialize(serialized)
    } catch (err) {
      // do nothing, its just not JSON:API probably
    }
  }

  return {
    text,
    status,
    serialized,
    deserialized,
  }
}

export async function GET(server, path) {
  const result = await request(server).get(path).set("authorization", "test")
  return parse(result)
}

export async function DELETE(server, path) {
  const result = await request(server).delete(path).set("authorization", "test")

  return await parse(result)
}

export async function POST(server, path, payload, type = "application/json") {
  const result = await request(server)
    .post(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

export async function PATCH(server, path, payload, type = "application/json") {
  const result = await request(server)
    .patch(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

export async function PUT(server, path, payload, type = "application/json") {
  const result = await request(server)
    .put(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

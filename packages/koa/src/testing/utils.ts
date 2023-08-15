import http from "node:http"

import type { HatchifyModel } from "@hatchifyjs/node"
import { HatchifyError, codes, statusCodes } from "@hatchifyjs/node"
import cors from "@koa/cors"
import * as dotenv from "dotenv"
import { Deserializer } from "jsonapi-serializer"
import Koa from "koa"
import type { Context } from "koa"
import request from "supertest"

import { Hatchify, errorHandlerMiddleware } from "../koa"

type Method = "get" | "post" | "patch" | "delete"
type Middleware = (ctx: Context) => void

export async function startServerWith(
  models: HatchifyModel[],
  middleware?: Middleware[],
): Promise<{
  fetch: (
    path: string,
    options?: { method?: Method; headers?: object; body?: object },
  ) => Promise<any>
  teardown: () => Promise<void>
  hatchify?
}> {
  dotenv.config({
    path: ".env",
  })
  const app = new Koa()
  const hatchify =
    process.env.DB_CONFIG === "postgres"
      ? new Hatchify(models, {
          prefix: "/api",
          database: {
            dialect: "postgres",
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          },
        })
      : new Hatchify(models, {
          prefix: "/api",
        })
  app.use(errorHandlerMiddleware)
  app.use(cors())
  app.use(hatchify.middleware.allModels.all)

  const server = http.createServer(app.callback())
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
    hatchify,
  }
}

export function createServer(app: Koa) {
  return http.createServer(app.callback())
}

async function parse(result) {
  let serialized
  let deserialized
  let text
  let status

  if (!result) {
    throw [
      new HatchifyError({
        title: "Invalid Result",
        code: codes.ERR_INVALID_RESULT,
        status: statusCodes.UNPROCESSABLE_ENTITY,
      }),
    ]
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

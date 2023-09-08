import http from "node:http"

import type { HatchifyModel, PartialSchema } from "@hatchifyjs/node"
import { HatchifyError, codes, statusCodes } from "@hatchifyjs/node"
import * as dotenv from "dotenv"
import { Deserializer } from "jsonapi-serializer"
import Koa from "koa"
import type { Dialect } from "sequelize"
import request from "supertest"

import { Hatchify, errorHandlerMiddleware } from "../koa"

type Method = "get" | "post" | "patch" | "delete"

export const dbDialects: Dialect[] = ["postgres", "sqlite"]

export async function startServerWith(
  models: HatchifyModel[] | { [schemaName: string]: PartialSchema },
  dialect: Dialect = "sqlite",
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
  const hatchify = new Hatchify(models, {
    prefix: "/api",
    database: {
      dialect,
      logging: false,
      ...(dialect === "postgres"
        ? {
            host: process.env.PG_DB_HOST,
            port: Number(process.env.PG_DB_PORT),
            username: process.env.PG_DB_USERNAME,
            password: process.env.PG_DB_PASSWORD,
            database: process.env.PG_DB_NAME,
          }
        : {
            storage: ":memory:",
          }),
    },
  })
  app.use(errorHandlerMiddleware)
  app.use(hatchify.middleware.allModels.all)

  const server = createServer(app)
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

  async function teardown() {
    if (dialect !== "sqlite") {
      // SQLite will throw if we try to drop
      await hatchify.orm.drop({ cascade: true })
    }

    return hatchify.orm.close()
  }

  return {
    fetch,
    teardown,
    hatchify,
  }
}

export function createServer(
  app: Koa,
): http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> {
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

interface DatabaseColumn {
  name: string
  notnull: "YES" | "NO"
  pk: 0 | 1
  type: string
}

export async function getDatabaseColumns(
  tableName: string,
  hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"],
): Promise<DatabaseColumn[]> {
  const dialect = hatchify.orm.getDialect()
  let columns: DatabaseColumn[] = []

  if (dialect === "sqlite") {
    ;[columns] = await hatchify._sequelize.query(
      `SELECT name, "notnull", pk, type FROM pragma_table_info('${tableName}')`,
    )
  } else if (dialect === "postgres") {
    const [[result], [constraints]] = await Promise.all([
      hatchify._sequelize.query(
        `SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = '${tableName}'`,
      ),
      hatchify._sequelize.query(
        `SELECT column_name, constraint_name FROM information_schema.key_column_usage WHERE table_name = '${tableName}'`,
      ),
    ])

    columns = result.map((column) => ({
      name: column.column_name,
      notnull: column.is_nullable,
      pk:
        column.column_name ===
        constraints.find(
          (constraint) => constraint.constraint_name === "user_pkey",
        ).column_name
          ? 1
          : 0,
      type: column.data_type,
    }))
  }

  return columns.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
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

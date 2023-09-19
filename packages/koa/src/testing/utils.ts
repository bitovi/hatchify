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

interface ForeignKey {
  schemaName: string
  tableName: string
  columnName: string
}

interface DatabaseColumn {
  name: string
  allowNull: boolean
  primary: boolean
  type: string
  foreignKeys?: ForeignKey[]
}

export async function getDatabaseColumns(
  hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"],
  tableName: string,
  schemaName = "public",
): Promise<DatabaseColumn[]> {
  const dialect: Dialect = hatchify.orm.getDialect()
  let columns: DatabaseColumn[] = []

  if (dialect === "sqlite") {
    const [[result], constraints] = await Promise.all([
      hatchify._sequelize.query(
        `SELECT name, "notnull", pk, type FROM pragma_table_info('${tableName}')`,
      ),
      hatchify._sequelize.query(`PRAGMA foreign_key_list(${tableName})`),
    ])

    columns = result.map((column) => {
      const foreignKeys = constraints.reduce(
        (acc, constraint) =>
          constraint.from === column.name
            ? [
                ...acc,
                {
                  tableName: constraint.table,
                  columnName: constraint.to,
                },
              ]
            : acc,
        [],
      )

      return {
        name: column.name,
        allowNull: column.notnull === 0,
        primary: column.pk !== 0,
        type: column.type,
        ...(foreignKeys.length ? { foreignKeys } : {}),
      }
    })
  } else if (dialect === "postgres") {
    const [[result], [constraints]] = await Promise.all([
      hatchify._sequelize.query(
        `
        SELECT column_name, is_nullable, data_type
        FROM information_schema.columns
        WHERE table_schema = :schemaName AND table_name = :tableName`,
        { replacements: { schemaName, tableName } },
      ),
      hatchify._sequelize.query(
        `
        SELECT
          tc.constraint_type AS type,
          kcu.column_name AS column,
          ccu.table_schema AS "foreignSchema",
          ccu.table_name AS "foreignTable",
          ccu.column_name AS "foreignColumn"
        FROM information_schema.table_constraints AS tc
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_schema = :schemaName AND tc.table_name = :tableName`,
        { replacements: { schemaName, tableName } },
      ),
    ])

    columns = result.map((column) => {
      const foreignKeys = constraints.reduce(
        (acc, constraint) =>
          constraint.column === column.column_name &&
          constraint.type === "FOREIGN KEY"
            ? [
                ...acc,
                {
                  schemaName: constraint.foreignSchema,
                  tableName: constraint.foreignTable,
                  columnName: constraint.foreignColumn,
                },
              ]
            : acc,
        [],
      )

      return {
        name: column.column_name,
        allowNull: column.is_nullable === "YES",
        primary: constraints.some(
          (constraint) =>
            constraint.column === column.column_name &&
            constraint.type === "PRIMARY KEY",
        ),
        type: column.data_type,
        ...(foreignKeys.length ? { foreignKeys } : {}),
      }
    })
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

/**
 * @deprecated Please use `startServerWith` and `fetch` instead
 */
export async function GET(server, path) {
  const result = await request(server).get(path).set("authorization", "test")
  return parse(result)
}

/**
 * @deprecated Please use `startServerWith` and `fetch` instead
 */
export async function DELETE(server, path) {
  const result = await request(server).delete(path).set("authorization", "test")

  return await parse(result)
}

/**
 * @deprecated Please use `startServerWith` and `fetch` instead
 */
export async function POST(server, path, payload, type = "application/json") {
  const result = await request(server)
    .post(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

/**
 * @deprecated Please use `startServerWith` and `fetch` instead
 */
export async function PATCH(server, path, payload, type = "application/json") {
  const result = await request(server)
    .patch(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

/**
 * @deprecated Please use `startServerWith` and `fetch` instead
 */
export async function PUT(server, path, payload, type = "application/json") {
  const result = await request(server)
    .put(path)
    .set("authorization", "test")
    .set("content-type", type)
    .send(payload)

  return await parse(result)
}

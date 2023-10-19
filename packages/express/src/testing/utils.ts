import type { PartialSchema } from "@hatchifyjs/node"
import * as dotenv from "dotenv"
import Express from "express"
import type { Dialect } from "sequelize"
import request from "supertest"

import { Hatchify, errorHandlerMiddleware } from "../express"

type Method = "get" | "post" | "patch" | "delete"

export const dbDialects: Dialect[] = ["postgres", "sqlite"]

export async function startServerWith(
  models: Record<string, PartialSchema>,
  dialect: Dialect = "sqlite",
): Promise<{
  app: any
  fetch: (
    path: string,
    options?: { method?: Method; headers?: object; body?: object },
  ) => Promise<any>
  teardown: () => Promise<void>
  hatchify: Hatchify
}> {
  dotenv.config({
    path: ".env",
  })
  const app = Express()
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

  const server = app
  await hatchify.createDatabase()

  async function fetch(
    path: string,
    options?: { method?: Method; headers?: object; body?: object },
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

  return { app, fetch, teardown, hatchify }
}

interface ForeignKey {
  schemaName?: string
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
  const dialect: Dialect = hatchify.orm.getDialect() as Dialect
  let columns: DatabaseColumn[] = []

  if (dialect === "sqlite") {
    type resultRow = {
      name: string
      notnull: number
      pk: number
      type: string
      dflt_value: string
    }
    type constraintRow = {
      from: string
      table: string
      to: string
    }

    const [[result], constraints] = (await Promise.all([
      hatchify.orm.query(
        `SELECT name, "notnull", pk, type, dflt_value FROM pragma_table_info('${tableName}')`,
      ),
      hatchify.orm.query(`PRAGMA foreign_key_list(${tableName})`),
    ])) as unknown as [[resultRow[]], constraintRow[]]

    columns = result.map((column: resultRow) => {
      const foreignKeys: ForeignKey[] = constraints.reduce<ForeignKey[]>(
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
        [] as ForeignKey[],
      )

      return {
        name: column.name,
        allowNull: column.notnull === 0,
        default: column.dflt_value,
        primary: column.pk !== 0,
        type: column.type,
        ...(foreignKeys.length ? { foreignKeys } : {}),
      }
    })
  } else if (dialect === "postgres") {
    type resultRow = {
      column_name: string
      is_nullable: string
      data_type: string
      column_default: string
    }
    type constraintRow = {
      type: string
      column: string
      foreignSchema: string
      foreignTable: string
      foreignColumn: string
    }
    const [[result], [constraints]] = (await Promise.all([
      hatchify.orm.query(
        `
        SELECT column_name, is_nullable, data_type, column_default
        FROM information_schema.columns
        WHERE table_schema = :schemaName AND table_name = :tableName`,
        { replacements: { schemaName, tableName } },
      ),
      hatchify.orm.query(
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
    ])) as unknown as [[resultRow[]], [constraintRow[]]]

    columns = result.map((column) => {
      const foreignKeys = constraints.reduce<ForeignKey[]>(
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
        [] as ForeignKey[],
      )

      return {
        name: column.column_name,
        allowNull: column.is_nullable === "YES",
        default: column.column_default,
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

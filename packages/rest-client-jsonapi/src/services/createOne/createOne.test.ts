import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { createOne } from "./createOne"

export const Patient = {
  name: "Patient",
  displayAttribute: "name",
  attributes: {
    name: { type: "STRING", allowNull: false },
    currentState: { type: "STRING", allowNull: false },
    currentStateDate: { type: "STRING", allowNull: false },
    dateAddedToSystem: { type: "STRING", allowNull: false },
    provider: { type: "STRING", allowNull: false },
  },
}

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = {
  Article: { type: "article", endpoint: "articles" },
  Person: { type: "person", endpoint: "people" },
  Tag: { type: "tag", endpoint: "tags" },
}
const sourceConfig = { baseUrl, schemaMap }

describe("Integration test with Hatchify Koa backend", async () => {
  it("works", async () => {
    const app = new Koa()
    const hatchedKoa = hatchifyKoa([Patient], {
      prefix: "/api",
      database: {
        dialect: "sqlite",
        storage: ":memory:",
        logging: true,
      },
    })

    app.use(cors())

    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.createDatabase()

    app.listen(3001, () => {
      console.log("🟢 Started on port 3001 🟢")
    })

    const data = await fetch("http://localhost:3001/api/patients")
    const json = await data.json()
    console.log("📊", json)
  })
})

describe("rest-client-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const expected = [
      {
        id: `article-id-${testData.data.length + 1}`,
        ...data,
      },
    ]
    const result = await createOne(sourceConfig, schemas, "Article", data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }

    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      rest.post(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(
          ctx.status(500),
          ctx.json({
            errors,
          }),
        ),
      ),
    )

    await expect(() =>
      createOne(sourceConfig, schemas, "Article", data),
    ).rejects.toEqual(errors)
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")
    await dataSource.createOne(schemas, "Article", data)
    expect(spy).toHaveBeenCalledWith(schemas, "Article", data)
  })
})

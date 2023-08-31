import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { testBackendEndpointConfig } from "../../setupTests"
import { createOne } from "./createOne"

const Article = {
  name: "Article",
  displayAttribute: "name",
  attributes: {
    author: { type: "STRING", allowNull: false },
    tag: { type: "STRING", allowNull: false },
  },
}
const schemas = { Article }
const schemaMap = {
  Article: { type: "article", endpoint: "articles" },
  Person: { type: "person", endpoint: "people" },
  Tag: { type: "tag", endpoint: "tags" },
}
const sourceConfig = { baseUrl, schemaMap }

describe("Testing CRUD operations against Hatchify backend", async () => {
  it("successfully runs createOne, updateOne, and deleteOne", async () => {
    const app = new Koa()
    const hatchedKoa = hatchifyKoa([Article], {
      prefix: `/${testBackendEndpointConfig.api}`,
      database: {
        dialect: "sqlite",
        storage: ":memory:",
      },
    })
    app.use(cors())
    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.createDatabase()
    app.listen(3001)

    const jsonApi = jsonapi("http://localhost:3001/api", {
      Article: { endpoint: `${testBackendEndpointConfig.schema}` },
    })
    const hatchedReactRest = hatchifyReactRest({ Article }, jsonApi)

    await hatchedReactRest.Article.createOne({
      attributes: {
        author: "John Doe",
        tag: "Hatchify",
      },
    })
    const createdArticleQuery = await hatchedReactRest.Article.findOne("1")
    expect(createdArticleQuery).toEqual({
      id: "1",
      __schema: "Article",
      author: "John Doe",
      tag: "Hatchify",
    })

    await hatchedReactRest.Article.updateOne({
      id: "1",
      attributes: {
        author: "John Doe Updated",
        tag: "Hatchify Updated",
      },
    })
    const updatedArticleQuery = await hatchedReactRest.Article.findOne("1")
    expect(updatedArticleQuery).toEqual({
      id: "1",
      __schema: "Article",
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })

    await hatchedReactRest.Article.deleteOne("1")
    const deletedArticleQuery = () => hatchedReactRest.Article.findOne("1")
    await expect(deletedArticleQuery).rejects.toThrow()
    expect.assertions(3) // Useful for confirming that assertions were actually called against asynchronous functions
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

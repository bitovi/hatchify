import cors from "@koa/cors"
import Koa from "koa"
import { describe, expect, it } from "vitest"
import { hatchifyKoa } from "@hatchifyjs/koa"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import jsonapi from "../rest-client-jsonapi"
import { testBackendEndpointConfig } from "../setupTests"
import { string, v2ToV1 } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

const Article: PartialSchema = {
  name: "Article",
  displayAttribute: "name",
  attributes: {
    author: string({ required: true }),
    tag: string({ required: true }),
  },
}

describe("Testing CRUD operations against Hatchify backend", async () => {
  it("successfully runs CRUD operations", async () => {
    const app = new Koa()
    const hatchedKoa = hatchifyKoa(
      { Article },
      {
        prefix: `/${testBackendEndpointConfig.api}`,
        database: {
          dialect: "sqlite",
          storage: ":memory:",
        },
      },
    )
    app.use(cors())
    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.createDatabase()
    app.listen(3001)

    const jsonApi = jsonapi(
      `http://localhost:3001/${testBackendEndpointConfig.api}`,
      {
        Article: { endpoint: `${testBackendEndpointConfig.schema}` },
      },
    )
    const hatchedReactRest = hatchifyReactRest(v2ToV1({ Article }), jsonApi)

    await hatchedReactRest.Article.createOne({
      attributes: {
        author: "John Doe",
        tag: "Hatchify",
      },
    })
    const [articles] = await hatchedReactRest.Article.findAll({})
    const [article] = articles
    const { id } = article
    expect(articles.length === 1)
    expect(article).toEqual({
      id,
      __schema: "Article",
      author: "John Doe",
      tag: "Hatchify",
    })

    await hatchedReactRest.Article.updateOne({
      id,
      attributes: {
        author: "John Doe Updated",
        tag: "Hatchify Updated",
      },
    })
    const updatedArticleQuery = await hatchedReactRest.Article.findOne(id)
    expect(updatedArticleQuery).toEqual({
      id,
      __schema: "Article",
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })

    await hatchedReactRest.Article.deleteOne(id)
    await expect(() => hatchedReactRest.Article.findOne(id)).rejects.toThrow()
    expect.assertions(4) // Useful for confirming that assertions were actually called against asynchronous functions
  })
})

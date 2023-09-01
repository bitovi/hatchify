import cors from "@koa/cors"
import Koa from "koa"
import { describe, expect, it } from "vitest"
import { hatchifyKoa } from "@hatchifyjs/koa"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import jsonapi from "../rest-client-jsonapi"
import { testBackendEndpointConfig } from "../setupTests"

const Article = {
  name: "Article",
  displayAttribute: "name",
  attributes: {
    author: { type: "STRING", allowNull: false },
    tag: { type: "STRING", allowNull: false },
  },
}

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
    await expect(() => hatchedReactRest.Article.findOne("1")).rejects.toThrow()
    expect.assertions(3) // Useful for confirming that assertions were actually called against asynchronous functions
  })
})

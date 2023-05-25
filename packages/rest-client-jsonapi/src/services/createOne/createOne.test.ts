import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { createOne } from "./createOne"

const ArticleSchema = { name: "Article" } as Schema
const schemaMap = { Article: { type: "article", endpoint: "articles" } }
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { attributes: { title: "Hello, World!" } }
    const expected = [
      {
        __schema: "Article",
        id: `article-id-${articles.length + 1}`,
        ...data,
      },
    ]
    const result = await createOne(sourceConfig, ArticleSchema, data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.post(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(() =>
      createOne(sourceConfig, ArticleSchema, {}),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const data = { attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")
    await dataSource.createOne(ArticleSchema, data)
    expect(spy).toHaveBeenCalledWith(ArticleSchema, data)
  })
})

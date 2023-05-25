import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { getOne } from "./getOne"

const ArticleSchema = { name: "Article" } as Schema
const schemaMap = { Article: { type: "article", endpoint: "articles" } }
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/getOne", () => {
  const query = { id: "article-id-1" }

  it("works", async () => {
    const expected = [
      {
        __schema: "Article",
        id: "article-id-1",
        attributes: {
          title: "Article 1",
          body: "Article 1 body",
        },
      },
    ]
    const result = await getOne(sourceConfig, ArticleSchema, query)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(
      getOne(sourceConfig, ArticleSchema, query),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "getOne")
    await dataSource.getOne(ArticleSchema, query)
    expect(spy).toHaveBeenCalledWith(ArticleSchema, query)
  })
})

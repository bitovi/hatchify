import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { getList } from "./getList"

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = { Article: { type: "article", endpoint: "articles" } }
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/getList", () => {
  it("works", async () => {
    const expected = articles.map((article) => ({
      __schema: "Article",
      attributes: article.attributes,
      id: article.id,
    }))
    const result = await getList(sourceConfig, schemas, "Article", {})
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(
      getList(sourceConfig, schemas, "Article", {}),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "getList")
    await dataSource.getList(schemas, "Article", {})
    expect(spy).toHaveBeenCalledWith(schemas, "Article", {})
  })
})

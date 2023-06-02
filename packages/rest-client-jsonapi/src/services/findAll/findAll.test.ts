import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { findAll } from "./findAll"

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = { Article: { type: "article", endpoint: "articles" } }
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/findAll", () => {
  const query = {
    fields: [],
    include: [],
    page: { size: 0, number: 0 },
    sort: {},
    filter: {},
  }

  it("works", async () => {
    const expected = articles.map((article) => ({
      __schema: "Article",
      attributes: article.attributes,
      id: article.id,
    }))

    const result = await findAll(sourceConfig, schemas, "Article", query)

    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(
      findAll(sourceConfig, schemas, "Article", query),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "findAll")
    await dataSource.findAll(schemas, "Article", query)
    expect(spy).toHaveBeenCalledWith(schemas, "Article", query)
  })
})

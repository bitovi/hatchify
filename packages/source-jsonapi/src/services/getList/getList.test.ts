import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/data-core"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../source-jsonapi"
import { getList } from "./getList"

const sourceConfig = { url: `${baseUrl}/articles`, type: "Article" }
const ArticleSchema = { name: "Article" } as Schema

describe("source-jsonapi/services/getList", () => {
  it("works", async () => {
    const expected = articles.map((article) => ({
      __schema: "Article",
      ...article,
    }))
    const result = await getList(sourceConfig, ArticleSchema, {})
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(getList(sourceConfig, ArticleSchema, {})).rejects.toThrowError(
      "request failed",
    )
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(sourceConfig)
    const spy = vi.spyOn(dataSource, "getList")
    await dataSource.getList(ArticleSchema, {})
    expect(spy).toHaveBeenCalledWith(ArticleSchema, {})
  })
})

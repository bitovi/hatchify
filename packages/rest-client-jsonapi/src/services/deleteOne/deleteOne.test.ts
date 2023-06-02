import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { deleteOne } from "./deleteOne"

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = { Article: { type: "article", endpoint: "articles" } }
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/deleteOne", () => {
  it("works", async () => {
    const data = "article-id-1"
    const expected = undefined
    const result = await deleteOne(sourceConfig, schemas, "Article", data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.delete(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(() =>
      deleteOne(sourceConfig, schemas, "Article", "article-id-1"),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const data = "article-id-2"
    const spy = vi.spyOn(dataSource, "deleteOne")
    await dataSource.deleteOne(schemas, "Article", data)
    expect(spy).toHaveBeenCalledWith(schemas, "Article", data)
  })
})

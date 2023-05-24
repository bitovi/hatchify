import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../rest-client-jsonapi"
import { updateOne } from "./updateOne"

const sourceConfig = { url: `${baseUrl}/articles`, type: "article" }
const ArticleSchema = { name: "Article" } as Schema

describe("rest-client-jsonapi/services/updateOne", () => {
  it("works", async () => {
    const data = { id: "article-id-1", attributes: { title: "A new world!" } }
    const expected = [
      {
        __schema: "Article",
        id: "article-id-1",
        attributes: {
          title: "A new world!",
          body: "Article 1 body",
        },
      },
    ]
    const result = await updateOne(sourceConfig, ArticleSchema, data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.patch(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(() =>
      updateOne(sourceConfig, ArticleSchema, {}),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(sourceConfig)
    const data = { id: "article-id-1", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "updateOne")
    await dataSource.updateOne(ArticleSchema, data)
    expect(spy).toHaveBeenCalledWith(ArticleSchema, data)
  })
})

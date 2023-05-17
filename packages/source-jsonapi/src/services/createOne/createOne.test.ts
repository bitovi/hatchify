import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../source-jsonapi"
import { createOne } from "./createOne"

const sourceConfig = { url: `${baseUrl}/articles`, type: "article" }
const ArticleSchema = { name: "Article" }

describe("source-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { attributes: { title: "Hello, World!" } }
    const expected = {
      data: {
        __schema: "Article",
        type: "Article",
        id: `article-id-${articles.length + 1}`,
        ...data,
      },
    }
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
    ).rejects.toThrowError("failed to create record")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(sourceConfig)
    const data = { attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")
    await dataSource.createOne(ArticleSchema, data)
    expect(spy).toHaveBeenCalledWith(ArticleSchema, data)
  })
})

import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl, articles } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import { jsonapi } from "../../source-jsonapi"
import { getOne } from "./getOne"

const sourceConfig = { url: `${baseUrl}/articles`, type: "article" }

describe("source-jsonapi/services/getOne", () => {
  const query = { id: "article-id-1" }

  it("works", async () => {
    const expected = {
      data: {
        ...articles.find((article) => article.id === "article-id-1"),
        __schema: "Article",
      },
    }
    const result = await getOne(sourceConfig, "Article", query)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(getOne(sourceConfig, "Article", query)).rejects.toThrowError(
      "failed to fetch record",
    )
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(sourceConfig)
    const spy = vi.spyOn(dataSource, "getOne")
    await dataSource.getOne("Article", query)
    expect(spy).toHaveBeenCalledWith("Article", query)
  })
})

import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findOne } from "./findOne"

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = {
  Article: { type: "article", endpoint: "articles" },
  Person: { type: "person", endpoint: "people" },
  Tag: { type: "tag", endpoint: "tags" },
}
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/findOne", () => {
  const query = { id: "article-id-1", fields: {}, include: [] }

  it("works", async () => {
    const expected = [
      {
        __schema: "Article",
        id: "article-id-1",
        attributes: {
          title: "Article 1",
          body: "Article 1 body",
        },
        relationships: {
          author: { id: "person-id-1", __schema: "Person" },
          tags: [
            { id: "tag-id-1", __schema: "Tag" },
            { id: "tag-id-2", __schema: "Tag" },
          ],
        },
      },
    ]
    const result = await findOne(sourceConfig, schemas, "Article", query)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    server.use(
      rest.get(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ error: "error message" })),
      ),
    )

    await expect(
      findOne(sourceConfig, schemas, "Article", query),
    ).rejects.toThrowError("request failed")
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "findOne")
    await dataSource.findOne(schemas, "Article", query)
    expect(spy).toHaveBeenCalledWith(schemas, "Article", query)
  })
})

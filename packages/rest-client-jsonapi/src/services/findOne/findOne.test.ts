import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findOne } from "./findOne"

const schemaMap = {
  Article: {
    ...({ name: "Article" } as Schema),
    type: "article",
    endpoint: "articles",
  },
  Person: {
    ...({ name: "Person" } as Schema),
    type: "person",
    endpoint: "people",
  },
  Tag: { ...({ name: "Tag" } as Schema), type: "tag", endpoint: "tags" },
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
    const result = await findOne(sourceConfig, schemaMap, "Article", query)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const errors = [
      {
        code: "missing-resource",
        source: {},
        status: 404,
        title: "Resource not found",
      },
    ]

    server.use(
      rest.get(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(
      findOne(sourceConfig, schemaMap, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "findOne")
    await dataSource.findOne(schemaMap, "Article", query)
    expect(spy).toHaveBeenCalledWith(schemaMap, "Article", query)
  })
})

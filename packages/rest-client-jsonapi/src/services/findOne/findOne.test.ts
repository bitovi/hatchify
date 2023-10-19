import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findOne } from "./findOne"
import { assembler } from "@hatchifyjs/core"

const partialSchemaMap = {
  Article: {
    name: "Article",
    attributes: {},
    type: "article",
    endpoint: "articles",
  },
  Person: {
    name: "Person",
    attributes: {},
    type: "person",
    endpoint: "people",
  },
  Tag: { name: "Tag", attributes: {}, type: "tag", endpoint: "tags" },
}
const sourceConfig = { baseUrl, schemaMap: partialSchemaMap }
const finalSchemaMap = assembler(partialSchemaMap)

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
    const result = await findOne(sourceConfig, finalSchemaMap, "Article", query)
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
      findOne(sourceConfig, finalSchemaMap, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemaMap)
    const spy = vi.spyOn(dataSource, "findOne")
    await dataSource.findOne(finalSchemaMap, "Article", query)
    expect(spy).toHaveBeenCalledWith(finalSchemaMap, "Article", query)
  })
})

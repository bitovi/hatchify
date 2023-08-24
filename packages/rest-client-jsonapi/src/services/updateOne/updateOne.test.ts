import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { updateOne } from "./updateOne"

const ArticleSchema = { name: "Article" } as Schema
const schemas = { Article: ArticleSchema }
const schemaMap = {
  Article: { type: "article", endpoint: "articles" },
  Person: { type: "person", endpoint: "people" },
  Tag: { type: "tag", endpoint: "tags" },
}
const sourceConfig = { baseUrl, schemaMap }

describe("rest-client-jsonapi/services/updateOne", () => {
  it("works", async () => {
    const data = {
      __schema: "Article",
      id: "article-id-1",
      attributes: { title: "A new world!" },
    }
    const expected = [
      {
        __schema: "Article",
        id: "article-id-1",
        attributes: {
          title: "A new world!",
          body: "Article 1 body",
        },
        relationships: {
          author: {
            __schema: "Person",
            id: "person-id-1",
          },
          tags: [
            {
              __schema: "Tag",
              id: "tag-id-1",
            },
            {
              __schema: "Tag",
              id: "tag-id-2",
            },
          ],
        },
      },
    ]
    const result = await updateOne(sourceConfig, schemas, "Article", data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      rest.patch(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(() =>
      updateOne(sourceConfig, schemas, "Article", {
        __schema: "Article",
        id: "article-id-1",
      }),
    ).rejects.toEqual(errors)
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const data = {
      __schema: "Article",
      id: "article-id-1",
      attributes: { title: "Hello, World!" },
    }
    const spy = vi.spyOn(dataSource, "updateOne")
    await dataSource.updateOne(schemas, "Article", data)
    expect(spy).toHaveBeenCalledWith(schemas, "Article", data)
  })
})

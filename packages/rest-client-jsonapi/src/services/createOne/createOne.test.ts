import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { createOne } from "./createOne"

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

describe("rest-client-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const expected = [
      {
        id: `article-id-${testData.data.length + 1}`,
        ...data,
      },
    ]
    const result = await createOne(sourceConfig, schemaMap, "Article", data)
    expect(result).toEqual(expected)
  })

  it("throws an error if the request fails", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }

    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      rest.post(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(
          ctx.status(500),
          ctx.json({
            errors,
          }),
        ),
      ),
    )

    await expect(() =>
      createOne(sourceConfig, schemaMap, "Article", data),
    ).rejects.toEqual(errors)
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")
    await dataSource.createOne(schemaMap, "Article", data)
    expect(spy).toHaveBeenCalledWith(schemaMap, "Article", data)
  })
})

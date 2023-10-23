import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { createOne } from "./createOne"
import { assembler, string } from "@hatchifyjs/core"

const partialSchemaMap = {
  Article: {
    name: "Article",
    attributes: {
      title: string(),
    },
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

describe("rest-client-jsonapi/services/createOne", () => {
  it("works", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const expected = [
      {
        id: `article-id-${testData.data.length + 1}`,
        ...data,
      },
    ]
    const result = await createOne<typeof partialSchemaMap, "Article">(
      sourceConfig,
      finalSchemaMap,
      "Article",
      data,
    )
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
      createOne<typeof partialSchemaMap, "Article">(
        sourceConfig,
        finalSchemaMap,
        "Article",
        data,
      ),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemaMap)
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")
    await dataSource.createOne(finalSchemaMap, "Article", data)
    expect(spy).toHaveBeenCalledWith(finalSchemaMap, "Article", data)
  })
})

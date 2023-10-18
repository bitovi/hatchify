import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { deleteOne } from "./deleteOne"
import { assembler } from "@hatchifyjs/core"

const partialSchemaMap = {
  Article: {
    name: "Article",
    attributes: {},
    type: "article",
    endpoint: "articles",
  },
}
const sourceConfig = { baseUrl, schemaMap: partialSchemaMap }
const finalSchemaMap = assembler(partialSchemaMap)

describe("rest-client-jsonapi/services/deleteOne", () => {
  it("works", async () => {
    const data = "article-id-1"
    const expected = undefined
    const result = await deleteOne(
      sourceConfig,
      finalSchemaMap,
      "Article",
      data,
    )
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
      rest.delete(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(() =>
      deleteOne(sourceConfig, finalSchemaMap, "Article", "article-id-1"),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemaMap)
    const data = "article-id-2"
    const spy = vi.spyOn(dataSource, "deleteOne")
    await dataSource.deleteOne(finalSchemaMap, "Article", data)
    expect(spy).toHaveBeenCalledWith(finalSchemaMap, "Article", data)
  })
})

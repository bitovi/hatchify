import { describe, expect, it, vi } from "vitest"
import { http } from "msw"
import { baseUrl } from "../../mocks/handlers.js"
import { server } from "../../mocks/server.js"
import jsonapi from "../../rest-client-jsonapi.js"
import { deleteOne } from "./deleteOne.js"
import { assembler } from "@hatchifyjs/core"

const partialSchemaMap = {
  Article: {
    name: "Article",
    attributes: {},
    type: "article",
    endpoint: "articles",
  },
}
const restClientConfig = { baseUrl, schemaMap: partialSchemaMap }
const finalSchemaMap = assembler(partialSchemaMap)

describe("rest-client-jsonapi/services/deleteOne", () => {
  it("works", async () => {
    const data = "article-id-1"
    const expected = undefined
    const result = await deleteOne(
      restClientConfig,
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
      http.delete(
        `${baseUrl}/articles/article-id-1`,
        () =>
          new Response(JSON.stringify({ errors }), {
            status: 500,
          }),
        { once: true },
      ),
    )

    await expect(() =>
      deleteOne(restClientConfig, finalSchemaMap, "Article", "article-id-1"),
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

import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findAll } from "./findAll"
import { convertToHatchifyResources } from "../utils"
import type { JsonApiResource } from "../jsonapi"
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

describe("rest-client-jsonapi/services/findAll", () => {
  const query = {
    fields: {},
    include: [],
    page: { size: 0, number: 0 },
    sort: "",
    filter: "",
  }

  it("works", async () => {
    const expected = convertToHatchifyResources(
      [...testData.data, ...testData.included] as JsonApiResource[],
      partialSchemaMap,
    )

    const result = await findAll(sourceConfig, finalSchemaMap, "Article", query)

    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual(testData.meta)
  })

  it("throws an error if the request fails", async () => {
    const errors = [
      {
        code: "invalid-query",
        source: {},
        status: 422,
        title: "Invalid query",
      },
    ]

    server.use(
      rest.get(`${baseUrl}/articles`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(
      findAll(sourceConfig, finalSchemaMap, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemaMap)
    const spy = vi.spyOn(dataSource, "findAll")
    await dataSource.findAll(finalSchemaMap, "Article", query)
    expect(spy).toHaveBeenCalledWith(finalSchemaMap, "Article", query)
  })
})

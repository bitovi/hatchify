import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import type { Schema } from "@hatchifyjs/rest-client"
import { baseUrl, testData } from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findAll } from "./findAll"
import { convertToHatchifyResources } from "../utils"
import type { JsonApiResource } from "../jsonapi"

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
      schemaMap,
    )

    const result = await findAll(sourceConfig, schemaMap, "Article", query)

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
      findAll(sourceConfig, schemaMap, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a Source", async () => {
    const dataSource = jsonapi(baseUrl, schemaMap)
    const spy = vi.spyOn(dataSource, "findAll")
    await dataSource.findAll(schemaMap, "Article", query)
    expect(spy).toHaveBeenCalledWith(schemaMap, "Article", query)
  })
})

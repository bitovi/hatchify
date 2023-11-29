import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import { baseUrl } from "../../mocks/handlers"
import {
  testData,
  finalSchemas,
  partialSchemas,
  restClientConfig,
} from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import type { JsonApiResource } from "../jsonapi"
import { convertToHatchifyResources } from "../utils"
import { findAll } from "./findAll"

describe("rest-client-jsonapi/services/findAll", () => {
  const query = {
    fields: {},
    include: [],
    page: { size: 0, number: 0 },
    sort: "",
    filter: "",
  }

  it("works", async () => {
    const expected = {
      records: convertToHatchifyResources(
        testData.data as JsonApiResource[],
        partialSchemas,
      ),
      related: convertToHatchifyResources(
        testData.included as unknown as JsonApiResource[],
        partialSchemas,
      ),
    }

    const result = await findAll(
      restClientConfig,
      finalSchemas,
      "Article",
      query,
    )

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
      findAll(restClientConfig, finalSchemas, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemas)
    const spy = vi.spyOn(dataSource, "findAll")

    await dataSource.findAll(finalSchemas, "Article", query)

    expect(spy).toHaveBeenCalledWith(finalSchemas, "Article", query)
  })
})

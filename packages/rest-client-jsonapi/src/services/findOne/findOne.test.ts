import { describe, expect, it, vi } from "vitest"
import { rest } from "msw"
import {
  baseUrl,
  finalSchemas,
  partialSchemas,
  restClientConfig,
  testData,
} from "../../mocks/handlers"
import { server } from "../../mocks/server"
import jsonapi from "../../rest-client-jsonapi"
import { findOne } from "./findOne"
import { convertToHatchifyResources } from "../utils"
import type { JsonApiResource } from "../jsonapi"

describe("rest-client-jsonapi/services/findOne", () => {
  const query = { id: "article-id-1", fields: {}, include: [] }

  it("works", async () => {
    const expected = {
      record: convertToHatchifyResources(
        testData.data[0] as JsonApiResource,
        partialSchemas,
      )[0],
      related: [],
    }

    const result = await findOne(
      restClientConfig,
      finalSchemas,
      "Article",
      query,
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
      rest.get(`${baseUrl}/articles/article-id-1`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({ errors })),
      ),
    )

    await expect(
      findOne(restClientConfig, finalSchemas, "Article", query),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemas)
    const spy = vi.spyOn(dataSource, "findOne")

    await dataSource.findOne(finalSchemas, "Article", query)

    expect(spy).toHaveBeenCalledWith(finalSchemas, "Article", query)
  })
})

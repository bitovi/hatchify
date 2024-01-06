import {
  describe,
  expect,
  it,
  vi,
  beforeAll,
  afterEach,
  afterAll,
} from "vitest"
import { http } from "msw"
import {
  baseUrl,
  finalSchemas,
  partialSchemas,
  restClientConfig,
  testData,
} from "../../mocks/handlers.js"
import { server } from "../../mocks/server.js"
import jsonapi from "../../rest-client-jsonapi.js"
import { findOne } from "./findOne.js"
import { convertToHatchifyResources } from "../utils/index.js"
import type { JsonApiResource } from "../jsonapi/index.js"

describe("rest-client-jsonapi/services/findOne", () => {
  beforeAll(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    server.close()
  })

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
      http.get(
        `${baseUrl}/articles/article-id-1`,
        () =>
          new Response(JSON.stringify({ errors }), {
            status: 500,
          }),
        { once: true },
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

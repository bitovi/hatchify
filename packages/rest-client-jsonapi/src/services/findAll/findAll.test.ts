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
  testData,
  finalSchemas,
  partialSchemas,
  restClientConfig,
} from "../../mocks/handlers.js"
import { server } from "../../mocks/server.js"
import jsonapi from "../../rest-client-jsonapi.js"
import type { JsonApiResource } from "../jsonapi/index.js"
import { convertToHatchifyResources } from "../utils/index.js"
import { findAll } from "./findAll.js"

describe("rest-client-jsonapi/services/findAll", () => {
  beforeAll(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    server.close()
  })

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
      http.get(
        `${baseUrl}/articles`,
        () =>
          new Response(JSON.stringify({ errors }), {
            status: 500,
          }),
        { once: true },
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

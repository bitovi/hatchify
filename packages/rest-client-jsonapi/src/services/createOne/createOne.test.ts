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
} from "../../mocks/handlers.js"
import { server } from "../../mocks/server.js"
import jsonapi from "../../rest-client-jsonapi.js"
import { createOne } from "./createOne.js"
import { convertToHatchifyResources } from "../utils/index.js"
import type { JsonApiResource } from "../jsonapi/index.js"

describe("rest-client-jsonapi/services/createOne", () => {
  beforeAll(() => {
    server.listen()
  })
  afterEach(() => {
    server.resetHandlers()
  })
  afterAll(() => {
    server.close()
  })

  it("works", async () => {
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }

    const expected = {
      record: convertToHatchifyResources(
        {
          type: "article",
          id: "article-id-4",
          attributes: {
            title: "Hello, World!",
          },
        } as JsonApiResource,
        partialSchemas,
      )[0],
      related: [],
    }

    const result = await createOne<typeof partialSchemas, "Article">(
      restClientConfig,
      finalSchemas,
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
      http.post(
        `${baseUrl}/articles`,
        () =>
          new Response(JSON.stringify({ errors }), {
            status: 500,
          }),
        { once: true },
      ),
    )

    await expect(() =>
      createOne<typeof partialSchemas, "Article">(
        restClientConfig,
        finalSchemas,
        "Article",
        data,
      ),
    ).rejects.toEqual(errors)
  })

  it("can be called from a rest client", async () => {
    const dataSource = jsonapi(baseUrl, partialSchemas)
    const data = { __schema: "Article", attributes: { title: "Hello, World!" } }
    const spy = vi.spyOn(dataSource, "createOne")

    await dataSource.createOne(finalSchemas, "Article", data)

    expect(spy).toHaveBeenCalledWith(finalSchemas, "Article", data)
  })
})

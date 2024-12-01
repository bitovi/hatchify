import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest"
import { baseUrl, testData } from "../../../mocks/handlers.js"
import { fetchJsonApi } from "./fetch.js"
import { server } from "../../../mocks/server.js"
import { http } from "msw"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/utils/fetch", () => {
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
    const data = await fetchJsonApi(
      "GET",
      `${baseUrl}/${schemaMap.Article.endpoint}`,
    )

    expect(data).toEqual({
      data: testData.data,
      included: testData.included,
      meta: testData.meta,
    })
  })

  it("throws an error if the request fails", async () => {
    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    server.use(
      http.get(
        `${baseUrl}/${schemaMap.Article.endpoint}`,
        () =>
          new Response(JSON.stringify({ errors }), {
            status: 500,
          }),
        { once: true },
      ),
    )

    await expect(() =>
      fetchJsonApi("GET", `${baseUrl}/${schemaMap.Article.endpoint}`),
    ).rejects.toEqual(errors)
  })

  it("throws a generic error if no error is returned", async () => {
    server.use(
      http.get(
        `${baseUrl}/${schemaMap.Article.endpoint}`,
        () =>
          new Response(JSON.stringify({}), {
            status: 500,
          }),
        { once: true },
      ),
    )

    await expect(() =>
      fetchJsonApi("GET", `${baseUrl}/${schemaMap.Article.endpoint}`),
    ).rejects.toEqual("Unknown error")
  })

  it("applies custom fetchOptions correctly", async () => {
    const customHeaders = {
      Authorization: "Bearer test-token",
      "Custom-Header": "test-value",
    }

    server.use(
      http.get(
        `${baseUrl}/${schemaMap.Article.endpoint}`,
        async ({ request }) => {
          // Verify the headers were properly set
          expect(request.headers.get("Authorization")).toBe("Bearer test-token")
          expect(request.headers.get("Custom-Header")).toBe("test-value")
          expect(request.headers.get("Content-Type")).toBe(
            "application/vnd.api+json",
          )

          return new Response(JSON.stringify(testData))
        },
        { once: true },
      ),
    )

    const data = await fetchJsonApi(
      "GET",
      `${baseUrl}/${schemaMap.Article.endpoint}`,
      undefined,
      {
        headers: customHeaders,
        credentials: "include",
      },
    )

    expect(data).toEqual({
      data: testData.data,
      included: testData.included,
      meta: testData.meta,
    })
  })
})

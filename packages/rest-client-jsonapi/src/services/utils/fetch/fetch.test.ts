import { describe, expect, it } from "vitest"
import { baseUrl, testData } from "../../../mocks/handlers"
import { fetchJsonApi } from "./fetch"
import { server } from "../../../mocks/server"
import { rest } from "msw"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/utils/fetch", () => {
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
      rest.get(`${baseUrl}/${schemaMap.Article.endpoint}`, (_, res, ctx) =>
        res.once(
          ctx.status(500),
          ctx.json({
            errors,
          }),
        ),
      ),
    )

    await expect(() =>
      fetchJsonApi("GET", `${baseUrl}/${schemaMap.Article.endpoint}`),
    ).rejects.toEqual(errors)
  })

  it("throws a generic error if no error is returned", async () => {
    server.use(
      rest.get(`${baseUrl}/${schemaMap.Article.endpoint}`, (_, res, ctx) =>
        res.once(ctx.status(500), ctx.json({})),
      ),
    )

    await expect(() =>
      fetchJsonApi("GET", `${baseUrl}/${schemaMap.Article.endpoint}`),
    ).rejects.toEqual("Unknown error")
  })
})

import { describe, expect, it } from "vitest"
import { getList, jsonapi } from "./source-jsonapi"
import { baseUrl, articles } from "./mocks/handlers"

describe("source-jsonapi", () => {
  const sourceConfig = { url: `${baseUrl}/articles`, type: "article" }
  const expected = {
    data: articles.map((article) => ({
      __schema: "Article",
      ...article,
    })),
  }

  describe("jsonapi", () => {
    it("returns a Source", async () => {
      const dataSource = jsonapi(sourceConfig)

      expect(dataSource).toEqual({
        version: "0.0.0",
        getList: expect.any(Function),
      })
    })
  })

  describe("getList", () => {
    it("works", async () => {
      const result = await getList(sourceConfig, "Article", {})

      expect(result).toEqual(expected)
    })

    it("can be called from a Source", async () => {
      const dataSource = jsonapi(sourceConfig)
      const result = await dataSource.getList("Article", {})

      expect(result).toEqual(expected)
    })
  })
})

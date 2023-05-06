import { describe, expect, it } from "vitest"
import { data, getList, fixtures } from "./source-fixtures"

describe("source-fixtures", () => {
  const sourceConfig = { type: "article", url: "articles" }
  const expected = {
    data: data.articles.map((article) => ({
      __schema: "Article",
      ...article,
    })),
  }

  describe("fixtures", () => {
    it("returns a Source", async () => {
      const dataSource = fixtures(sourceConfig)

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
      const dataSource = fixtures(sourceConfig)
      const result = await dataSource.getList("Article", {})

      expect(result).toEqual(expected)
    })
  })
})

import { describe, expect, it, vi } from "vitest"
import { createOne, fixtureData, getList, fixtures } from "./source-fixtures"

describe("source-fixtures", () => {
  const sourceConfig = { type: "article", url: "articles" }

  describe("fixtures", () => {
    it("returns a Source", async () => {
      const dataSource = fixtures(sourceConfig)

      expect(dataSource).toEqual({
        version: "0.0.0",
        getList: expect.any(Function),
        createOne: expect.any(Function),
      })
    })
  })

  describe("getList", () => {
    const expected = {
      data: fixtureData.articles.map((article) => ({
        __schema: "Article",
        ...article,
      })),
    }

    it("works", async () => {
      const result = await getList(sourceConfig, "Article", {})
      expect(result).toEqual(expected)
    })

    it("can be called from a Source", async () => {
      const dataSource = fixtures(sourceConfig)
      const spy = vi.spyOn(dataSource, "getList")
      await dataSource.getList("Article", {})
      expect(spy).toHaveBeenCalledWith("Article", {})
    })
  })

  describe("createOne", () => {
    it("works", async () => {
      const data = { attributes: { title: "Hello, World!" } }
      const expected = {
        data: {
          __schema: "Article",
          id: `articles-${fixtureData.articles.length + 1}`,
          ...data,
        },
      }
      const result = await createOne(sourceConfig, "Article", data)
      expect(result).toEqual(expected)
    })

    it("can be called from a Source", async () => {
      const dataSource = fixtures(sourceConfig)
      const data = { attributes: { title: "Hello, World!" } }
      const spy = vi.spyOn(dataSource, "createOne")
      await dataSource.createOne("Article", data)
      expect(spy).toHaveBeenCalledWith("Article", data)
    })
  })
})

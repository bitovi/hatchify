import { describe, expect, it, vi } from "vitest"
import { createOne, getList, jsonapi } from "./source-jsonapi"
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
        createOne: expect.any(Function),
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
          type: "Article",
          id: `article-id-${articles.length + 1}`,
          ...data,
        },
      }
      const result = await createOne(sourceConfig, "Article", data)
      expect(result).toEqual(expected)
    })

    it("can be called from a Source", async () => {
      const dataSource = jsonapi(sourceConfig)
      const data = { attributes: { title: "Hello, World!" } }
      const spy = vi.spyOn(dataSource, "createOne")
      await dataSource.createOne("Article", data)
      expect(spy).toHaveBeenCalledWith("Article", data)
    })
  })
})

import { describe, expect, it } from "vitest"
import { createOne, getList, jsonapi } from "./source-jsonapi"
import { baseUrl, articles } from "shared/mocks/handlers"

describe("source-jsonapi", () => {
  describe("jsonapi", () => {
    it("returns a DataSource", async () => {
      const dataSource = jsonapi({ baseUrl })

      expect(dataSource).toEqual({
        getList: expect.any(Function),
        createOne: expect.any(Function),
      })
    })
  })

  describe("getList", () => {
    it("works", async () => {
      const config = { baseUrl, resource: "articles" }
      const result = await getList(config, {})

      expect(result).toEqual({ data: articles })
    })

    it("can be called from a DataSource", async () => {
      const dataSource = jsonapi({ baseUrl })
      const result = await dataSource.getList("articles", {})

      expect(result).toEqual({ data: articles })
    })
  })

  describe("createOne", () => {
    it("works", async () => {
      const config = { baseUrl, resource: "articles" }
      const result = await createOne(config, {
        title: "title",
        body: "body",
      })

      expect(result).toEqual({
        data: {
          type: "Article",
          id: `article-id-${articles.length}`,
          attributes: {
            title: "title",
            body: "body",
          },
        },
      })
    })

    it("can be called from a DataSource", async () => {
      const dataSource = jsonapi({ baseUrl })
      const result = await dataSource.createOne("articles", {
        title: "title",
        body: "body",
      })

      expect(result).toEqual({
        data: {
          type: "Article",
          id: `article-id-${articles.length}`,
          attributes: {
            title: "title",
            body: "body",
          },
        },
      })
    })
  })
})

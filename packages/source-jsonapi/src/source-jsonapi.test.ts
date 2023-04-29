import { describe, expect, it } from "vitest"
import { getList, jsonapi } from "./source-jsonapi"
import { baseUrl, articles } from "@shared/mocks/handlers"

describe("source-jsonapi", () => {
  describe("jsonapi", () => {
    it("returns a DataSource", async () => {
      const dataSource = jsonapi({ baseUrl })

      expect(dataSource).toEqual({
        getList: expect.any(Function),
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
})

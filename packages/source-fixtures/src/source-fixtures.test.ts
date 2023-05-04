import { describe, expect, it } from "vitest"
import { data, getList, fixtures } from "./source-fixtures"

describe("source-fixtures", () => {
  describe("fixtures", () => {
    it("returns a DataSource", async () => {
      const dataSource = fixtures()

      expect(dataSource).toEqual({
        getList: expect.any(Function),
      })
    })
  })

  describe("getList", () => {
    it("works", async () => {
      const result = await getList({ resource: "articles" }, {})

      expect(result).toEqual({ data: data.articles })
    })

    it("can be called from a DataSource", async () => {
      const dataSource = fixtures()
      const result = await dataSource.getList("articles", {})

      expect(result).toEqual({ data: data.articles })
    })
  })
})

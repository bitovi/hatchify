import { afterEach, describe, it, expect } from "vitest"
import { getList } from "./promise"
import { convertRecordArrayToById, createStore } from "../store"
import { data, fixtures } from "source-fixtures"

describe("data-core/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["articles"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      const store = createStore(["articles"])
      const dataSource = fixtures()
      const result = await getList(dataSource, "articles", {})
      const expected = data.articles

      expect(result).toEqual(expected)
      expect(store.articles.data).toEqual(convertRecordArrayToById(expected))
    })
  })
})

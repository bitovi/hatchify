import { afterEach, describe, it, expect } from "vitest"
import { getList } from "./promise"
import { convertRecordArrayToById, createStore } from "../store"
import { articles } from "../mocks/handlers"

describe("data/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["articles"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      const store = createStore(["articles"])
      const result = await getList("articles", {})

      expect(result).toEqual(articles)
      expect(store.articles.data).toEqual(convertRecordArrayToById(articles))
    })
  })
})

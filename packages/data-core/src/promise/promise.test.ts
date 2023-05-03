import { afterEach, describe, it, expect } from "vitest"
import { getList } from "./promise"
import { convertRecordArrayToById, createStore } from "../store"
import { articles, baseUrl } from "../mocks/handlers"
import { jsonapi } from "source-jsonapi"

describe("data-core/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["articles"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      const store = createStore(["articles"])
      const dataSource = jsonapi({ baseUrl })
      const result = await getList(dataSource, "articles", {})

      expect(result).toEqual(articles)
      expect(store.articles.data).toEqual(convertRecordArrayToById(articles))
    })
  })
})

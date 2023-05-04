import { afterEach, describe, it, expect } from "vitest"
import { getList } from "./promise"
import { convertRecordArrayToById, createStore } from "../store"
import type { Source } from "../types"

const fakeData = [
  { id: "1", title: "foo", body: "foo-body" },
  { id: "2", title: "bar", body: "bar-body" },
]

const fakeDataSource: Source = {
  getList: () =>
    Promise.resolve({
      data: fakeData,
    }),
}

describe("data-core/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["articles"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      createStore(["articles"])
      const result = await getList(fakeDataSource, "articles", {})
      const expected = fakeData

      expect(result).toEqual(expected)
    })

    it("should insert the records into the store", async () => {
      const store = createStore(["articles"])
      await getList(fakeDataSource, "articles", {})
      const expected = convertRecordArrayToById(fakeData)

      expect(store.articles.data).toEqual(expected)
    })
  })
})

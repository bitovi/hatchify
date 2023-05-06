import { afterEach, describe, it, expect } from "vitest"
import { getList } from "./promise"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../store"
import type { Source } from "../types"

const fakeData = [
  {
    id: "1",
    __schema: "Article",
    attributes: { title: "foo", body: "foo-body" },
  },
  {
    id: "2",
    __schema: "Article",
    attributes: { title: "bar", body: "bar-body" },
  },
]

const fakeDataSource: Source = {
  version: "0.0.0",
  getList: () =>
    Promise.resolve({
      data: fakeData,
    }),
}

describe("data-core/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article"])
  })

  describe("getList", () => {
    it("should return a list of records", async () => {
      createStore(["Article"])
      const result = await getList(fakeDataSource, "Article", {})
      const expected = fakeData.map(convertResourceToRecord)

      expect(result).toEqual(expected)
    })

    it("should insert the records into the store", async () => {
      const store = createStore(["Article"])
      await getList(fakeDataSource, "Article", {})
      const expected = keyResourcesById(fakeData)

      expect(store.Article.data).toEqual(expected)
    })
  })
})

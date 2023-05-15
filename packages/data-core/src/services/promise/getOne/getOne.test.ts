import { afterEach, describe, it, expect } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Resource, Source } from "../../types"
import { getOne } from "./getOne"

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
  version: 0,
  getList: () => Promise.resolve({ data: [] }),
  getOne: () => Promise.resolve({ data: fakeData[0] }),
  createOne: () => Promise.resolve({ data: {} as Resource }),
}

describe("data-core/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article"])
  })

  describe("getOne", () => {
    const query = { id: "1" }

    it("should return a record", async () => {
      createStore(["Article"])
      const result = await getOne(fakeDataSource, "Article", query)
      const expected = convertResourceToRecord(fakeData[0])

      expect(result).toEqual(expected)
    })

    it("should insert the record into the store", async () => {
      const store = createStore(["Article"])
      await getOne(fakeDataSource, "Article", query)
      const expected = keyResourcesById([fakeData[0]])

      expect(store.Article.data).toEqual(expected)
    })

    it("should throw an error if the request fails", async () => {
      const errorDataSource = {
        ...fakeDataSource,
        getOne: () => Promise.reject(new Error("network error")),
      }

      await expect(
        getOne(errorDataSource, "Article", query),
      ).rejects.toThrowError("network error")
    })
  })
})

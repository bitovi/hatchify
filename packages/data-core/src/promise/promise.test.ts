import { afterEach, describe, it, expect, vi } from "vitest"
import { createOne, getList } from "./promise"
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
  createOne: () =>
    Promise.resolve({
      data: {
        id: "3",
        __schema: "Article",
        attributes: { title: "baz", body: "baz-body" },
      },
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

  describe("createOne", () => {
    const data = {
      attributes: { title: "baz", body: "baz-body" },
    }
    const expected = {
      id: "3",
      __schema: "Article",
      attributes: { title: "baz", body: "baz-body" },
    }

    it("should return the new record", async () => {
      const result = await createOne(fakeDataSource, "Article", data)
      expect(result).toEqual(convertResourceToRecord(expected))
    })

    it("should insert the record into the store", async () => {
      const store = createStore(["Article"])
      await createOne(fakeDataSource, "Article", data)
      expect(store.Article.data).toEqual(keyResourcesById([expected]))
    })

    it("should notify subscribers", async () => {
      const store = createStore(["Article"])
      const subscriber = vi.fn()
      store.Article.subscribers.push(subscriber)
      await createOne(fakeDataSource, "Article", data)
      expect(subscriber).toHaveBeenCalledTimes(1)
    })
  })
})

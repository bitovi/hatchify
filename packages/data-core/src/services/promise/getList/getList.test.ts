import { describe, it, expect } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Resource, Source } from "../../types"
import { getList } from "./getList"

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
  getList: () => Promise.resolve({ data: fakeData }),
  getOne: () => Promise.resolve({ data: {} as Resource }),
  createOne: () => Promise.resolve({ data: {} as Resource }),
}

describe("data-core/services/promise/getList", () => {
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

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      getList: () => Promise.reject(new Error("network error")),
    }

    await expect(getList(errorDataSource, "Article", {})).rejects.toThrowError(
      "network error",
    )
  })
})

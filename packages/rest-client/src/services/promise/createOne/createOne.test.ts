import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { createOne } from "./createOne"
import { flattenResourcesIntoRecords } from "../../utils/records"
import {
  fakeDataSource,
  testDataRecords,
  testFinalSchemas,
} from "../../mocks/testData"
import type { testPartialSchemas } from "../../mocks/testData"

describe("rest-client/services/promise/createOne", () => {
  const createData = { attributes: { title: "Code Review", important: true } }

  it("should return the new record", async () => {
    createStore(["Article"])

    const result = await createOne<typeof testPartialSchemas, "Todo">(
      fakeDataSource,
      testFinalSchemas,
      "Todo",
      createData,
    )

    expect(result).toEqual(
      flattenResourcesIntoRecords(testFinalSchemas, testDataRecords[0], []),
    )
  })

  it("should notify subscribers", async () => {
    const store = createStore(["Article"])
    const subscriber = vi.fn()
    store.Article.subscribers.push(subscriber)
    await createOne<typeof testPartialSchemas, "Todo">(
      fakeDataSource,
      testFinalSchemas,
      "Todo",
      createData,
    )
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      createOne: () => Promise.reject(errors),
    }

    await expect(
      createOne<typeof testPartialSchemas, "Todo">(
        errorDataSource,
        testFinalSchemas,
        "Todo",
        createData,
      ),
    ).rejects.toEqual(errors)
  })

  it("should throw error if schema name is not a string", async () => {
    await expect(
      createOne<typeof testPartialSchemas, "Todo">(
        fakeDataSource,
        testFinalSchemas,
        1 as any,
        createData,
      ),
    ).rejects.toThrowError()
  })
})

import { describe, it, expect } from "vitest"
import { createStore } from "../../store"
import { updateOne } from "./updateOne"
import { flattenResourcesIntoRecords } from "../../utils/records"
import {
  fakeDataSource,
  testDataRecords,
  testFinalSchemas,
} from "../../mocks/testData"
import type { testPartialSchemas } from "../../mocks/testData"

describe("rest-client/services/promise/updateOne", () => {
  const updateData = { id: "todo-1", title: "foo" }

  it("should return the new record", async () => {
    createStore(["Article"])

    const result = await updateOne<typeof testPartialSchemas, "Todo">(
      fakeDataSource,
      testFinalSchemas,
      "Todo",
      updateData,
    )

    expect(result).toEqual(
      flattenResourcesIntoRecords(
        testFinalSchemas,
        {
          ...testDataRecords[0],
          attributes: { ...testDataRecords[0].attributes, title: "foo" },
        },
        [],
      ),
    )
  })

  it.todo("should insert the record into the store")

  it.todo("should notify subscribers")

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "missing-resource",
        source: {},
        status: 404,
        title: "Resource not found",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      updateOne: () => Promise.reject(errors),
    }

    await expect(
      updateOne<typeof testPartialSchemas, "Todo">(
        errorDataSource,
        testFinalSchemas,
        "Todo",
        updateData,
      ),
    ).rejects.toEqual(errors)
  })
})

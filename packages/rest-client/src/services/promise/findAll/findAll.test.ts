import { describe, it, expect } from "vitest"
import { createStore } from "../../store"
import { findAll } from "./findAll"
import { flattenResourcesIntoRecords } from "../../utils"
import {
  fakeDataSource,
  testDataRecords,
  testDataRelatedRecords,
  testFinalSchemas,
} from "../../mocks/testData"
import type { testPartialSchemas } from "../../mocks/testData"

describe("rest-client/services/promise/findAll", () => {
  it("should return a list of records", async () => {
    createStore(["Article"])
    const result = await findAll<typeof testPartialSchemas, "Todo">(
      fakeDataSource,
      testFinalSchemas,
      "Todo",
      {},
    )

    expect(result[0]).toEqual(
      flattenResourcesIntoRecords(
        testFinalSchemas,
        testDataRecords,
        testDataRelatedRecords,
      ),
    )
    expect(result[1]).toEqual({ unpaginatedCount: 2 })
  })

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "invalid-query",
        source: {},
        status: 422,
        title: "Invalid query",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      findAll: () => Promise.reject(errors),
    }

    await expect(
      findAll<typeof testPartialSchemas, "Todo">(
        errorDataSource,
        testFinalSchemas,
        "Todo",
        {},
      ),
    ).rejects.toEqual(errors)
  })
})

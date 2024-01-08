import { afterEach, describe, it, expect } from "vitest"
import { createStore } from "../../store/index.js"
import { findOne } from "./findOne.js"
import { flattenResourcesIntoRecords } from "../../utils/index.js"
import {
  fakeDataSource,
  testDataRecords,
  testDataRelatedRecords,
  testFinalSchemas,
} from "../../mocks/testData.js"
import type { testPartialSchemas } from "../../mocks/testData.js"

describe("rest-client/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article"])
  })

  describe("findOne", () => {
    it("should return a record", async () => {
      createStore(["Article"])
      const result = await findOne<typeof testPartialSchemas, "Todo">(
        fakeDataSource,
        testFinalSchemas,
        "Todo",
        { id: "article-1" },
      )

      expect(result).toEqual(
        flattenResourcesIntoRecords(
          testFinalSchemas,
          testDataRecords[0],
          testDataRelatedRecords,
        ),
      )
    })

    it("should work if query is a string", async () => {
      createStore(["Article"])
      const result = await findOne<typeof testPartialSchemas, "Todo">(
        fakeDataSource,
        testFinalSchemas,
        "Todo",
        "article-1",
      )

      expect(result).toEqual(
        flattenResourcesIntoRecords(
          testFinalSchemas,
          testDataRecords[0],
          testDataRelatedRecords,
        ),
      )
    })

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
        findOne: () => Promise.reject(errors),
      }

      await expect(
        findOne<typeof testPartialSchemas, "Todo">(
          errorDataSource,
          testFinalSchemas,
          "Todo",
          { id: "article-1" },
        ),
      ).rejects.toEqual(errors)
    })
  })
})

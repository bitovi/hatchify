import { describe, it, expect } from "vitest"
import type { Source } from "@hatchifyjs/rest-client"
import { hatchifyReactRest } from "./hatchifyReactRest"

const fakeDataSource: Source = {
  completeSchemaMap: {
    Article: {
      name: "Article",
      type: "Article",
      attributes: {
        title: "string",
        body: "string",
      },
    },
    Person: {
      name: "Person",
      type: "Person",
      attributes: {
        name: "string",
        age: "integer",
      },
    },
  },
  version: 0,
  findAll: () => Promise.resolve([[], {}]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

describe("react-rest/services/hatchifyReactRest", () => {
  it("should return functions for each schema", () => {
    const api = hatchifyReactRest(fakeDataSource)

    expect(api).toEqual({
      Article: {
        createOne: expect.any(Function),
        deleteOne: expect.any(Function),
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        updateOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        useDeleteOne: expect.any(Function),
        useAll: expect.any(Function),
        useOne: expect.any(Function),
        useUpdateOne: expect.any(Function),
      },
      Person: {
        createOne: expect.any(Function),
        deleteOne: expect.any(Function),
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        updateOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        useDeleteOne: expect.any(Function),
        useAll: expect.any(Function),
        useOne: expect.any(Function),
        useUpdateOne: expect.any(Function),
      },
    })
  })
})

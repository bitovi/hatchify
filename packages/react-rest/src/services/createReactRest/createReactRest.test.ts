import { describe, it, expect } from "vitest"
import type { Source } from "@hatchifyjs/rest-client"
import { createReactRest } from "./createReactRest"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

describe("react-rest/services/createReactRest", () => {
  it("should return functions for each schema", () => {
    const Article = {
      name: "Article",
      attributes: {
        title: "string",
        body: "string",
      },
    }
    const Person = {
      name: "Person",
      attributes: {
        name: "string",
        age: "number",
      },
    }

    const api = createReactRest({ Article, Person }, fakeDataSource)

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
        subscribeToAll: expect.any(Function),
        subscribeToOne: expect.any(Function),
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
        subscribeToAll: expect.any(Function),
        subscribeToOne: expect.any(Function),
      },
    })
  })
})

import { describe, it, expect } from "vitest"
import type { Source } from "@hatchifyjs/rest-client"
import { hatchifyReactRest } from "./hatchifyReactRest"
import type { Schema } from "@hatchifyjs/rest-client"
import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([[], {}]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

describe("react-rest/services/hatchifyReactRest", () => {
  it("should return functions for each schema", () => {
    const Article: LegacySchema = {
      name: "Article",
      attributes: {
        title: "string",
        body: "string",
      },
    }
    const Person: LegacySchema = {
      name: "Person",
      attributes: {
        name: "string",
        age: "number",
      },
    }

    const api = hatchifyReactRest({ Article, Person }, fakeDataSource)

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

  it("should accept both legacy and new schema", () => {
    const Article: LegacySchema = {
      name: "Article",
      attributes: {
        title: "string",
        body: "string",
      },
    }

    const Person: Schema = {
      name: "Person",
      displayAttribute: "name",
      attributes: {
        name: "string",
        age: "number",
      },
      relationships: {
        Article: {
          type: "many",
          schema: "yes",
        },
      },
    }

    const api = hatchifyReactRest({ Article, Person }, fakeDataSource)

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

import { describe, it, expect } from "vitest"
import type { Schema as LegacySchema } from "@hatchifyjs/core"
import type { Schema, Source } from "@hatchifyjs/rest-client"
import { hatchifyReact } from "./hatchifyReact"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([[], {}]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

describe("react-ui/hatchifyReact", () => {
  it("should return objects for each schema", () => {
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
        age: "integer",
      },
    }

    const api = hatchifyReact({ Article, Person }, fakeDataSource)

    expect(api).toEqual({
      components: {
        Article: {
          Collection: expect.any(Function),
          Column: expect.any(Function),
          Empty: expect.any(Function),
        },
        Person: {
          Collection: expect.any(Function),
          Column: expect.any(Function),
          Empty: expect.any(Function),
        },
      },
      model: {
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
      },
      state: {
        Article: { useCollectionState: expect.any(Function) },
        Person: { useCollectionState: expect.any(Function) },
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
        age: "integer",
      },
      relationships: {
        Article: {
          type: "many",
          schema: "yes",
        },
      },
    }

    const api = hatchifyReact({ Article, Person }, fakeDataSource)

    expect(api).toEqual({
      components: {
        Article: {
          Collection: expect.any(Function),
          Column: expect.any(Function),
          Empty: expect.any(Function),
        },
        Person: {
          Collection: expect.any(Function),
          Column: expect.any(Function),
          Empty: expect.any(Function),
        },
      },
      model: {
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
      },
      state: {
        Article: { useCollectionState: expect.any(Function) },
        Person: { useCollectionState: expect.any(Function) },
      },
    })
  })

  it("should accept schemas with namespaces", () => {
    const Feature_Article: LegacySchema = {
      name: "Article",
      namespace: "Feature",
      attributes: {
        title: "string",
        body: "string",
      },
    }

    const api = hatchifyReact({ Feature_Article }, fakeDataSource)

    expect(api).toEqual({
      components: {
        Feature_Article: {
          Collection: expect.any(Function),
          Column: expect.any(Function),
          Empty: expect.any(Function),
        },
      },
      model: {
        Feature_Article: {
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
      },
      state: { Feature_Article: { useCollectionState: expect.any(Function) } },
    })
  })
})

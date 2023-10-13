import { describe, it, expect } from "vitest"
import type { Source } from "@hatchifyjs/rest-client"
import { hatchifyReact } from "./hatchifyReact"

describe("react-ui/hatchifyReact", () => {
  it("should return objects for each schema", () => {
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

    const api = hatchifyReact(fakeDataSource)

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
    const fakeDataSource: Source = {
      completeSchemaMap: {
        Feature_Article: {
          name: "Article",
          type: "Article",
          namespace: "Feature",
          attributes: {
            title: "string",
            body: "string",
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

    const api = hatchifyReact(fakeDataSource)

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

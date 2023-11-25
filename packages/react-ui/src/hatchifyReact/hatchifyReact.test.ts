import { describe, it, expect } from "vitest"
import type { RestClient } from "@hatchifyjs/rest-client"
import { hatchifyReact } from "./hatchifyReact"
import { integer, string } from "@hatchifyjs/core"

describe("react-ui/hatchifyReact", () => {
  it("should return objects for each schema", () => {
    const fakeDataSource: RestClient<any, any> = {
      completeSchemaMap: {
        Article: {
          name: "Article",
          type: "Article",
          attributes: {
            title: string(),
            body: string(),
          },
        },
        Person: {
          name: "Person",
          type: "Person",
          attributes: {
            name: string(),
            age: integer(),
          },
        },
      },
      version: 0,
      findAll: () => Promise.resolve([{ records: [], related: [] }, {}]),
      findOne: () => Promise.resolve({ record: {} as any, related: [] }),
      createOne: () => Promise.resolve({ record: {} as any, related: [] }),
      updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
      deleteOne: () => Promise.resolve(),
    }

    const api = hatchifyReact(fakeDataSource)

    expect(api).toEqual({
      Everything: expect.any(Function),
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
    const fakeDataSource: RestClient<any, any> = {
      completeSchemaMap: {
        Feature_Article: {
          name: "Article",
          type: "Article",
          namespace: "Feature",
          attributes: {
            title: string(),
            body: string(),
          },
        },
      },
      version: 0,
      findAll: () => Promise.resolve([{ records: [], related: [] }, {}]),
      findOne: () => Promise.resolve({ record: {} as any, related: [] }),
      createOne: () => Promise.resolve({ record: {} as any, related: [] }),
      updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
      deleteOne: () => Promise.resolve(),
    }

    const api = hatchifyReact(fakeDataSource)

    expect(api).toEqual({
      Everything: expect.any(Function),
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

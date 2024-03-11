import { describe, it, expect } from "vitest"
import type { RestClient } from "@hatchifyjs/rest-client"
import { hatchifyReact } from "./hatchifyReact.js"
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
      NoSchemas: expect.any(Function),
      Navigation: expect.any(Function),
      components: {
        Article: {
          DataGrid: expect.any(Function),
          Filters: expect.any(Function),
          List: expect.any(Function),
          Pagination: expect.any(Function),
        },
        Person: {
          DataGrid: expect.any(Function),
          Filters: expect.any(Function),
          List: expect.any(Function),
          Pagination: expect.any(Function),
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
        Article: { useDataGridState: expect.any(Function) },
        Person: { useDataGridState: expect.any(Function) },
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
      NoSchemas: expect.any(Function),
      Navigation: expect.any(Function),
      components: {
        Feature_Article: {
          DataGrid: expect.any(Function),
          Filters: expect.any(Function),
          List: expect.any(Function),
          Pagination: expect.any(Function),
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
      state: { Feature_Article: { useDataGridState: expect.any(Function) } },
    })
  })
})

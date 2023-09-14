import { describe, expect, it } from "vitest"
import type { SchemaRecord } from "@hatchifyjs/react-rest"
import { reactJsonapi } from "./react-jsonapi"

const TestSchema: SchemaRecord = {
  Article: {
    name: "Article",
    displayAttribute: "title",
    attributes: { title: "string", body: "string" },
  },
  Person: {
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
  },
}

const ArticleMap = {
  article: {
    type: "Article",
  },
}
describe("react-jsonapi", () =>
  it("works", () => {
    const reactRest = reactJsonapi(
      TestSchema,
      "http://localhost:3000/api",
      ArticleMap,
    )

    expect(reactRest).toEqual({
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
  }))

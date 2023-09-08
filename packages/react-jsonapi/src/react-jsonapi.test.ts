import { describe, expect, it } from "vitest"
import { reactJsonapi } from "./react-jsonapi"
import { integer } from "@hatchifyjs/hatchify-core"

const TestSchema = {
  Article: {
    name: "Article",
    attributes: { views: integer() },
  },
  Person: {
    name: "Person",
    attributes: {
      age: integer(),
    },
    // todo: v2 relationships
    // relationships: {
    //   Article: {
    //     type: "many",
    //     schema: "yes",
    //   },
    // },
  },
}

const ArticleMap = {
  article: {
    type: "Article",
    endpoint: "article",
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
        // deleteOne: expect.any(Function),
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        updateOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        // useDeleteOne: expect.any(Function),
        useAll: expect.any(Function),
        useOne: expect.any(Function),
        useUpdateOne: expect.any(Function),
        // subscribeToAll: expect.any(Function),
        // subscribeToOne: expect.any(Function),
      },
      Person: {
        createOne: expect.any(Function),
        // deleteOne: expect.any(Function),
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        updateOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        // useDeleteOne: expect.any(Function),
        useAll: expect.any(Function),
        useOne: expect.any(Function),
        useUpdateOne: expect.any(Function),
        // subscribeToAll: expect.any(Function),
        // subscribeToOne: expect.any(Function),
      },
    })
  }))

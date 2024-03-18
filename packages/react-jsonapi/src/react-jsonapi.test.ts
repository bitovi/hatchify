import { describe, expect, it } from "vitest"
import { hatchifyReactRest, createJsonapiClient } from "./react-jsonapi.js"
import { hasMany, integer } from "@hatchifyjs/core"

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
    relationships: {
      article: hasMany("Article"),
    },
  },
}

describe("react-jsonapi", () =>
  it("works", () => {
    const reactRest = hatchifyReactRest(
      createJsonapiClient("http://localhost:3000/api", TestSchema),
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
        // subscribeToAll: expect.any(Function),
        // subscribeToOne: expect.any(Function),
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
        // subscribeToAll: expect.any(Function),
        // subscribeToOne: expect.any(Function),
      },
    })
  }))

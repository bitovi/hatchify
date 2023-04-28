import { describe, it, expect } from "vitest"
import { reactRest } from "./react-rest"
import type { Schema } from "./react-rest"

describe("react-rest", () => {
  it("should return functions for each schema", () => {
    const Article: Schema = {
      name: "Article",
      resource: "articles",
      displayAttribute: "title",
      attributes: {
        title: "string",
        body: "string",
      },
    }
    const Person: Schema = {
      name: "Person",
      resource: "people",
      displayAttribute: "name",
      attributes: {
        name: "string",
        age: "number",
      },
    }

    const api = reactRest({ Article, Person })

    expect(api).toEqual({
      Article: {
        getList: expect.any(Function),
        useList: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
      Person: {
        getList: expect.any(Function),
        useList: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
    })
  })
})

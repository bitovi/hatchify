import { describe, it, expect } from "vitest"
import { reactRest } from "./react-rest"
import type { ReactSchema } from "./react-rest"
import type { Source } from "data-core"

const fakeDataSource: Source = {
  getList: () =>
    Promise.resolve({
      data: [],
    }),
}

describe("react-rest", () => {
  it("should return functions for each schema", () => {
    const Article: ReactSchema = {
      dataSource: fakeDataSource,
      schema: {
        name: "Article",
        resource: "articles",
        displayAttribute: "title",
        attributes: {
          title: "string",
          body: "string",
        },
      },
    }
    const Person: ReactSchema = {
      dataSource: fakeDataSource,
      schema: {
        name: "Person",
        resource: "people",
        displayAttribute: "name",
        attributes: {
          name: "string",
          age: "number",
        },
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

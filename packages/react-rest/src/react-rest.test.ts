import { describe, it, expect } from "vitest"
import { reactRest } from "./react-rest"
import type { ReactSchema } from "./react-rest"
import type { Source } from "data-core"
import type { Resource } from "data-core"

const fakeDataSource: Source = {
  version: "0.0.0",
  getList: () =>
    Promise.resolve({
      data: [] as Resource[],
    }),
  createOne: () =>
    Promise.resolve({
      data: {} as Resource,
    }),
}

describe("react-rest", () => {
  it("should return functions for each schema", () => {
    const Article: ReactSchema = {
      dataSource: fakeDataSource,
      schema: {
        name: "Article",
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
        createOne: expect.any(Function),
        useList: expect.any(Function),
        useCreateOne: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
      Person: {
        getList: expect.any(Function),
        createOne: expect.any(Function),
        useList: expect.any(Function),
        useCreateOne: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
    })
  })
})

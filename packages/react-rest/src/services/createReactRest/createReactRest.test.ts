import { describe, it, expect } from "vitest"
import type { Resource, Source } from "@hatchifyjs/data-core"
import type { ReactSchema } from "./createReactRest"
import { createReactRest } from "./createReactRest"

const fakeDataSource: Source = {
  version: 0,
  getList: () => Promise.resolve({ data: [] as Resource[] }),
  getOne: () => Promise.resolve({ data: {} as Resource }),
  createOne: () => Promise.resolve({ data: {} as Resource }),
}

describe("react-rest/services/createReactRest", () => {
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

    const api = createReactRest({ Article, Person })

    expect(api).toEqual({
      Article: {
        createOne: expect.any(Function),
        getList: expect.any(Function),
        getOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        useList: expect.any(Function),
        useOne: expect.any(Function),
        subscribeToList: expect.any(Function),
        subscribeToOne: expect.any(Function),
      },
      Person: {
        createOne: expect.any(Function),
        getList: expect.any(Function),
        getOne: expect.any(Function),
        useCreateOne: expect.any(Function),
        useList: expect.any(Function),
        useOne: expect.any(Function),
        subscribeToList: expect.any(Function),
        subscribeToOne: expect.any(Function),
      },
    })
  })
})

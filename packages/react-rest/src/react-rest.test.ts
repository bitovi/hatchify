import { describe, it, expect } from "vitest"
import { jsonapi } from "source-jsonapi"
import { reactRest } from "./react-rest"
import type { ReactSchema } from "./react-rest"
import { baseUrl } from "shared/mocks/handlers"

describe("react-rest", () => {
  it("should return functions for each schema", () => {
    const dataSource = jsonapi({ baseUrl })

    const Article: ReactSchema = {
      dataSource,
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
      dataSource,
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
        createOne: expect.any(Function),
        getList: expect.any(Function),
        useCreateOne: expect.any(Function),
        useList: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
      Person: {
        createOne: expect.any(Function),
        getList: expect.any(Function),
        useCreateOne: expect.any(Function),
        useList: expect.any(Function),
        subscribeToList: expect.any(Function),
      },
    })
  })
})

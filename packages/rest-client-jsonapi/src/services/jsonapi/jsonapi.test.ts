import { describe, expect, it } from "vitest"
import { baseUrl } from "../../mocks/handlers"
import { jsonapi } from "./jsonapi"

const schemaMap = {
  Article: {
    name: "Article",
    attributes: {
      name: { type: "STRING" },
    },
  },
}

describe("rest-client-jsonapi/services/jsonapi", () => {
  describe("jsonapi", () => {
    it("returns a Source", async () => {
      const dataSource = jsonapi(baseUrl, schemaMap)
      expect(dataSource).toEqual({
        completeSchemaMap: {
          Article: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "Article",
            endpoint: "articles",
            type: "Article",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })

    it("accepts a schemaMap with a pluralName", async () => {
      const dataSource = jsonapi(baseUrl, {
        Article: {
          name: "Article",
          attributes: {
            name: { type: "STRING" },
          },
          pluralName: "Articles",
        },
      })
      expect(dataSource).toEqual({
        completeSchemaMap: {
          Article: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "Article",
            pluralName: "Articles",
            endpoint: "articles",
            type: "Article",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })

    it("Adds an 's' and sets the pluralName when one is not provided", async () => {
      const dataSource = jsonapi(baseUrl, {
        Article: {
          name: "Article",
          attributes: {
            name: { type: "STRING" },
          },
        },
      })
      expect(dataSource).toEqual({
        completeSchemaMap: {
          Article: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "Article",
            endpoint: "articles",
            type: "Article",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })
    it("Keeps the pluralName when one is provided", async () => {
      const dataSource = jsonapi(baseUrl, {
        Article: {
          name: "Article",
          attributes: {
            name: { type: "STRING" },
          },
          pluralName: "Collection",
        },
      })
      expect(dataSource).toEqual({
        completeSchemaMap: {
          Article: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "Article",
            pluralName: "Collection",
            endpoint: "collection",
            type: "Article",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })
    it("Formats the pluralName to lowercase as adds dashes", async () => {
      const dataSource = jsonapi(baseUrl, {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: { type: "STRING" },
          },
          pluralName: "SalesPeople",
        },
      })
      expect(dataSource).toEqual({
        completeSchemaMap: {
          SalesPerson: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "SalesPerson",
            pluralName: "SalesPeople",
            endpoint: "sales-people",
            type: "SalesPerson",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })

    it("Leaves pluralName intact if already in correct format", async () => {
      const dataSource = jsonapi(baseUrl, {
        SalesPerson: {
          name: "SalesPerson",
          attributes: {
            name: { type: "STRING" },
          },
          pluralName: "SalesPeople",
        },
      })
      expect(dataSource).toEqual({
        completeSchemaMap: {
          SalesPerson: {
            attributes: {
              name: {
                type: "STRING",
              },
            },
            name: "SalesPerson",
            pluralName: "SalesPeople",
            endpoint: "sales-people",
            type: "SalesPerson",
          },
        },
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })
  })
})

import { describe, expect, it } from "vitest"
import { baseUrl } from "../../mocks/handlers"
import { jsonapi } from "./jsonapi"
import { string } from "@hatchifyjs/core"

const schemaMap = {
  Article: {
    name: "Article",
    attributes: {
      name: string(),
    },
  },
}

describe("rest-client-jsonapi/services/jsonapi", () => {
  describe("jsonapi", () => {
    it.only("returns a rest client", async () => {
      const dataSource = jsonapi(baseUrl, schemaMap)

      expect(dataSource.completeSchemaMap.Article.name).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.endpoint).toEqual("articles")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.type).toEqual("Article")
      // expect(dataSource.findAll).toEqual(expect.any(Function))
      // expect(dataSource.findOne).toEqual(expect.any(Function))
      // expect(dataSource.createOne).toEqual(expect.any(Function))
      // expect(dataSource.updateOne).toEqual(expect.any(Function))
      // expect(dataSource.deleteOne).toEqual(expect.any(Function))
      // expect(dataSource).toEqual({
      //   completeSchemaMap: {
      //     Article: {
      //       attributes: {
      //         name: {
      //           type: "STRING",
      //         },
      //       },
      //       name: "Article",
      //       endpoint: "articles",
      //       type: "Article",
      //     },
      //   },
      //   version: 0,
      //   findAll: expect.any(Function),
      //   findOne: expect.any(Function),
      //   createOne: expect.any(Function),
      //   updateOne: expect.any(Function),
      //   deleteOne: expect.any(Function),
      // })
    })

    it("accepts a schemaMap with a pluralName", async () => {
      const dataSource = jsonapi(baseUrl, {
        Article: {
          name: "Article",
          attributes: {
            name: string(),
          },
          pluralName: "articles",
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
            pluralName: "articles",
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
            name: string(),
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
            name: string(),
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
            name: string(),
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
            name: string(),
          },
          pluralName: "sales-people",
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
            pluralName: "sales-people",
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

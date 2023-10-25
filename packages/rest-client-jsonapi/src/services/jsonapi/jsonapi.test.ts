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
    it("returns a rest client", async () => {
      const dataSource = jsonapi(baseUrl, schemaMap)

      expect(dataSource.completeSchemaMap.Article.name).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.endpoint).toEqual("articles")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.type).toEqual("Article")
      expect(dataSource.findAll).toEqual(expect.any(Function))
      expect(dataSource.findOne).toEqual(expect.any(Function))
      expect(dataSource.createOne).toEqual(expect.any(Function))
      expect(dataSource.updateOne).toEqual(expect.any(Function))
      expect(dataSource.deleteOne).toEqual(expect.any(Function))
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

      expect(dataSource.completeSchemaMap.Article.name).toEqual("Article")
      expect(dataSource.completeSchemaMap.Article.pluralName).toEqual(
        "articles",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.type).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.endpoint).toEqual("articles")
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

      expect(dataSource.completeSchemaMap.Article.name).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.type).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.endpoint).toEqual("articles")
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

      expect(dataSource.completeSchemaMap.Article.name).toEqual("Article")
      expect(dataSource.completeSchemaMap.Article.pluralName).toEqual(
        "Collection",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.type).toEqual("Article")
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.Article.endpoint).toEqual(
        "collection",
      )
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

      expect(dataSource.completeSchemaMap.SalesPerson.name).toEqual(
        "SalesPerson",
      )
      expect(dataSource.completeSchemaMap.SalesPerson.pluralName).toEqual(
        "SalesPeople",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.SalesPerson.type).toEqual(
        "SalesPerson",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.SalesPerson.endpoint).toEqual(
        "sales-people",
      )
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

      expect(dataSource.completeSchemaMap.SalesPerson.name).toEqual(
        "SalesPerson",
      )
      expect(dataSource.completeSchemaMap.SalesPerson.pluralName).toEqual(
        "sales-people",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.SalesPerson.type).toEqual(
        "SalesPerson",
      )
      // @ts-expect-error
      expect(dataSource.completeSchemaMap.SalesPerson.endpoint).toEqual(
        "sales-people",
      )
    })
  })
})

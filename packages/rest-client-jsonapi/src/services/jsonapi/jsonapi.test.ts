import { describe, expect, it } from "vitest"
import type { Schemas } from "@hatchifyjs/rest-client"
import { baseUrl } from "../../mocks/handlers"
import {
  jsonapi,
  fetchJsonApi,
  jsonApiResourceToRecord,
  convertToRecords,
  fieldsToQueryParam,
  getQueryParams,
  includeToQueryParam,
} from "./jsonapi"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/jsonapi", () => {
  describe("jsonapi", () => {
    it("returns a Source", async () => {
      const dataSource = jsonapi(baseUrl, schemaMap)
      expect(dataSource).toEqual({
        version: 0,
        getList: expect.any(Function),
        getOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })
  })

  describe("fetchJsonApi", () => {
    it("works", async () => {
      const data = await fetchJsonApi(
        "GET",
        `${baseUrl}/${schemaMap.Article.endpoint}`,
      )
      expect(data).toEqual({
        data: [
          {
            id: "article-id-1",
            type: "Article",
            attributes: { title: "Article 1", body: "Article 1 body" },
          },
          {
            id: "article-id-2",
            type: "Article",
            attributes: { title: "Article 2", body: "Article 2 body" },
          },
          {
            id: "article-id-3",
            type: "Article",
            attributes: { title: "Article 3", body: "Article 3 body" },
          },
        ],
      })
    })
  })

  describe("jsonApiResourceToRecord", () => {
    it("works", () => {
      const resource = {
        id: "1",
        type: "article",
        attributes: { title: "foo", body: "foo-body" },
      }
      expect(jsonApiResourceToRecord(resource, "Article")).toEqual({
        id: "1",
        __schema: "Article",
        attributes: {
          title: "foo",
          body: "foo-body",
        },
      })
    })
  })

  describe("convertToRecords", () => {
    it("works", () => {
      const resources = [
        {
          id: "1",
          type: "article",
          attributes: { title: "foo", body: "foo-body" },
        },
        {
          id: "2",
          type: "article",
          attributes: { title: "bar", body: "bar-body" },
        },
      ]
      expect(convertToRecords(resources, "Article")).toEqual([
        {
          id: "1",
          __schema: "Article",
          attributes: {
            title: "foo",
            body: "foo-body",
          },
        },
        {
          id: "2",
          __schema: "Article",
          attributes: {
            title: "bar",
            body: "bar-body",
          },
        },
      ])
    })
  })

  describe("Query param helper funcitons", () => {
    const schemas: Schemas = {
      Book: {
        name: "Book",
        displayAttribute: "title",
        attributes: {
          title: "string",
          year: "number",
        },
        relationships: {
          author: {
            type: "one",
            schema: "Person",
          },
          illustrators: {
            type: "many",
            schema: "Person",
          },
        },
      },
      Person: {
        name: "Person",
        displayAttribute: "name",
        attributes: {
          name: "string",
          rating: "number",
        },
        relationships: {
          authored: {
            type: "many",
            schema: "Book",
          },
          illustrated: {
            type: "many",
            schema: "Book",
          },
        },
      },
    }
    const schemaMap = {
      Book: { type: "book_type", endpoint: "books" },
      Person: { type: "person_type", endpoint: "people" },
    }

    describe("fieldsToQueryParam", () => {
      it("works", () => {
        expect(
          fieldsToQueryParam(schemaMap, schemas, "Book", [
            "title",
            "body",
            "author.name",
            "author.email",
            "illustrators.name",
            "illustrators.email",
          ]),
        ).toEqual("fields[book_type]=title,body&fields[person_type]=name,email")

        expect(
          fieldsToQueryParam(schemaMap, schemas, "Person", [
            "firstName",
            "age",
            "authored.title",
            "authored.year",
            "illustrated.title",
            "illustrated.year",
          ]),
        ).toEqual(
          "fields[person_type]=firstName,age&fields[book_type]=title,year",
        )
      })
    })

    describe("getQueryParams", () => {
      it("works for when include and fields have values", () => {
        expect(
          getQueryParams(
            schemaMap,
            schemas,
            "Book",
            [
              "title",
              "body",
              "author.name",
              "author.email",
              "illustrators.name",
              "illustrators.email",
            ],
            ["author", "illustrators"],
          ),
        ).toEqual(
          "?include=author,illustrators&fields[book_type]=title,body&fields[person_type]=name,email",
        )

        expect(
          getQueryParams(
            schemaMap,
            schemas,
            "Person",
            [
              "firstName",
              "age",
              "illustrated.title",
              "illustrated.year",
              "authored.title",
              "authored.year",
            ],
            ["illustrated", "authored"],
          ),
        ).toEqual(
          "?include=illustrated,authored&fields[person_type]=firstName,age&fields[book_type]=title,year",
        )
      })

      it("works for when fields has values and include is empty", () => {
        expect(
          getQueryParams(schemaMap, schemas, "Book", ["title", "body"], []),
        ).toEqual("?include=fields[book_type]=title,body")

        expect(
          getQueryParams(
            schemaMap,
            schemas,
            "Person",
            ["firstName", "age"],
            [],
          ),
        ).toEqual("?include=fields[person_type]=firstName,age")
      })

      it("works when both fields and include are empty", () => {
        expect(getQueryParams(schemaMap, schemas, "Book", [], [])).toEqual("")
        expect(getQueryParams(schemaMap, schemas, "Person", [], [])).toEqual("")
      })
    })

    describe("includeToQueryParam", () => {
      it("works", () => {
        expect(includeToQueryParam(["author", "illustrators"])).toEqual(
          "include=author,illustrators",
        )

        expect(includeToQueryParam(["illustrated", "authored"])).toEqual(
          "include=illustrated,authored",
        )
      })
    })
  })
})

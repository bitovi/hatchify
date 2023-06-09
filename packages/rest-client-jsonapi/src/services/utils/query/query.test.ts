import { describe, expect, it } from "vitest"
import type { Schemas } from "@hatchifyjs/rest-client"
import {
  fieldsToQueryParam,
  getQueryParams,
  includeToQueryParam,
} from "./query"

describe("rest-client-jsonapi/services/utils/query", () => {
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
        // todo: switch to commented out when backend returns id with each resource
        // "?include=author,illustrators&fields[book_type]=title,body&fields[person_type]=name,email",
        "?include=author,illustrators&",
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
        // todo: switch to commented out when backend returns id with each resource
        // "?include=illustrated,authored&fields[person_type]=firstName,age&fields[book_type]=title,year",
        "?include=illustrated,authored&",
      )
    })

    it("works for when fields has values and include is empty", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", ["title", "body"], []),
        // todo: switch to commented out when backend returns id with each resource
        // ).toEqual("?include=fields[book_type]=title,body")
      ).toEqual("?include=")

      expect(
        getQueryParams(schemaMap, schemas, "Person", ["firstName", "age"], []),
        // todo: switch to commented out when backend returns id with each resource
        // ).toEqual("?include=fields[person_type]=firstName,age")
      ).toEqual("?include=")
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

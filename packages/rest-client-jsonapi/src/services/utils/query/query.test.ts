import { describe, expect, it } from "vitest"
import type { Schemas } from "@hatchifyjs/rest-client"
import {
  fieldsToQueryParam,
  getQueryParams,
  includeToQueryParam,
  sortToQueryParam,
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
        fieldsToQueryParam(schemaMap, schemas, "Book", {
          Book: ["title", "body"],
          author: ["name", "email"],
          illustrators: ["name", "email"],
        }),
      ).toEqual("fields[Book]=title,body&fields[Person]=name,email")

      expect(
        fieldsToQueryParam(schemaMap, schemas, "Person", {
          Person: ["firstName", "age"],
          authored: ["title", "year"],
          illustrated: ["title", "year"],
        }),
      ).toEqual("fields[Person]=firstName,age&fields[Book]=title,year")
    })
  })

  describe("getQueryParams", () => {
    it("works for when include and fields have values", () => {
      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Book",
          {
            Book: ["title", "body"],
            author: ["name", "email"],
            illustrators: ["name", "email"],
          },
          ["author", "illustrators"],
        ),
      ).toEqual(
        "?include=author,illustrators&fields[Book]=title,body&fields[Person]=name,email&",
      )

      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Person",
          {
            Person: ["firstName", "age"],
            illustrated: ["title", "year"],
            authored: ["title", "year"],
          },
          ["illustrated", "authored"],
        ),
      ).toEqual(
        "?include=illustrated,authored&fields[Person]=firstName,age&fields[Book]=title,year&",
      )
    })

    it("works for when fields has values and include is empty", () => {
      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Book",
          { Book: ["title", "body"] },
          [],
        ),
      ).toEqual("?include=fields[Book]=title,body&")

      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Person",
          { Person: ["firstName", "age"] },
          [],
        ),
      ).toEqual("?include=fields[Person]=firstName,age&")
    })

    it("works when both fields and include are empty", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", {}, [])).toEqual("")
      expect(getQueryParams(schemaMap, schemas, "Person", {}, [])).toEqual("")
    })

    it("works when sort is a string", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", {}, [])).toEqual("")
      expect(
        getQueryParams(schemaMap, schemas, "Person", {}, [], "-created"),
      ).toEqual("?sort=-created&")
    })

    it("works when sort is an array of strings", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", {}, [])).toEqual("")
      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Person",
          {},
          [],
          ["-created", "title", "user.name"],
        ),
      ).toEqual("?sort=-created,title,user.name&")
    })

    it("works when include, fields, sort have values", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", {}, [])).toEqual("")
      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Person",
          {
            Person: ["firstName", "age"],
            illustrated: ["title", "year"],
            authored: ["title", "year"],
          },
          ["illustrated", "authored"],
          ["-created", "title", "user.name"],
        ),
      ).toEqual(
        "?include=illustrated,authored&fields[Person]=firstName,age&fields[Book]=title,year&sort=-created,title,user.name&",
      )
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

  describe("sortToQueryParam", () => {
    it("works", () => {
      expect(sortToQueryParam(["-created", "title", "user.name"])).toEqual(
        "sort=-created,title,user.name",
      )

      expect(sortToQueryParam("-created")).toEqual("sort=-created")
    })
  })
})

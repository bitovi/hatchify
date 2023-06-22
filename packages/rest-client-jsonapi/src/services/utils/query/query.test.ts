import { describe, expect, it } from "vitest"
import type { Schemas } from "@hatchifyjs/rest-client"
import {
  fieldsToQueryParam,
  filterToQueryParam,
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
        "?include=author,illustrators",
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
        "?include=illustrated,authored",
      )
    })

    it("works for when fields has values and include is empty", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", ["title", "body"], []),
        // todo: switch to commented out when backend returns id with each resource
        // ).toEqual("?include=fields[book_type]=title,body")
      ).toEqual("")

      expect(
        getQueryParams(schemaMap, schemas, "Person", ["firstName", "age"], []),
        // todo: switch to commented out when backend returns id with each resource
        // ).toEqual("?include=fields[person_type]=firstName,age")
      ).toEqual("")
    })

    it("works when both fields and include are empty", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", [], [])).toEqual("")
      expect(getQueryParams(schemaMap, schemas, "Person", [], [])).toEqual("")
    })

    it("works when sort is a string", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", [], [])).toEqual("")

      expect(
        getQueryParams(schemaMap, schemas, "Person", [], [], "-created"),
      ).toEqual("?sort=-created")
    })

    it("works when sort is an array of strings", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", [], [])).toEqual("")

      expect(
        getQueryParams(
          schemaMap,
          schemas,
          "Person",
          [],
          [],
          ["-created", "title", "user.name"],
        ),
      ).toEqual("?sort=-created,title,user.name")
    })

    it("works when include, fields, sort, filter have values", () => {
      expect(getQueryParams(schemaMap, schemas, "Book", [], [])).toEqual("")

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
          ["-created", "title", "user.name"],
          { name: ["John", "Joan"], age: 21, employed: false },
        ),
      ).toEqual(
        "?include=illustrated,authored&sort=-created,title,user.name&filter[name][]=John&filter[name][]=Joan&filter[age]=21&filter[employed]=false",
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

  describe("filterToQueryParam", () => {
    it("works", () => {
      expect(filterToQueryParam({})).toEqual("")

      expect(
        filterToQueryParam("filter[name]=ABC&filter[completed]=true"),
      ).toEqual("filter[name]=ABC&filter[completed]=true")

      expect(filterToQueryParam({ name: "ABC" })).toEqual("filter[name]=ABC")

      expect(filterToQueryParam({ name: ["ABC", "DEF"] })).toEqual(
        "filter[name][]=ABC&filter[name][]=DEF",
      )

      expect(filterToQueryParam({ completed: false })).toEqual(
        "filter[completed]=false",
      )

      expect(
        filterToQueryParam({ name: ["ABC", "DEF"], count: 3, completed: true }),
      ).toEqual(
        "filter[name][]=ABC&filter[name][]=DEF&filter[count]=3&filter[completed]=true",
      )
    })
  })
})

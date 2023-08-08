import { describe, expect, it } from "vitest"
import type { Schemas } from "@hatchifyjs/rest-client"
import {
  fieldsToQueryParam,
  filterToQueryParam,
  getQueryParams,
  includeToQueryParam,
  pageToQueryParam,
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
        date: "string",
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
        fieldsToQueryParam(schemas, "Book", {
          Book: ["title", "body"],
          author: ["name", "email"],
          illustrators: ["name", "email"],
        }),
      ).toEqual("fields[Book]=title,body&fields[Person]=name,email")

      expect(
        fieldsToQueryParam(schemas, "Person", {
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
        getQueryParams(schemaMap, schemas, "Book", {
          fields: {
            Book: ["title", "body"],
            author: ["name", "email"],
            illustrators: ["name", "email"],
          },
          include: ["author", "illustrators"],
        }),
      ).toEqual(
        "?include=author,illustrators&fields[Book]=title,body&fields[Person]=name,email",
      )

      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: {
            Person: ["firstName", "age"],
            illustrated: ["title", "year"],
            authored: ["title", "year"],
          },
          include: ["illustrated", "authored"],
        }),
      ).toEqual(
        "?include=illustrated,authored&fields[Person]=firstName,age&fields[Book]=title,year",
      )
    })

    it("works for when fields has values and include is empty", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", {
          fields: { Book: ["title", "body"] },
          include: [],
        }),
      ).toEqual("?fields[Book]=title,body")

      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: { Person: ["firstName", "age"] },
          include: [],
        }),
      ).toEqual("?fields[Person]=firstName,age")
    })

    it("works when both fields and include are empty", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", { fields: {}, include: [] }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: {},
          include: [],
        }),
      ).toEqual("")
    })

    it("works when sort is a string", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", { fields: {}, include: [] }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: {},
          include: [],
          sort: "-created",
        }),
      ).toEqual("?sort=-created")
    })

    it("works when sort is an array of strings", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", { fields: {}, include: [] }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: {},
          include: [],
          sort: ["-created", "title", "user.name"],
        }),
      ).toEqual("?sort=-created,title,user.name")
    })

    it("works when include, fields, sort, filter, and page have values", () => {
      expect(
        getQueryParams(schemaMap, schemas, "Book", { fields: {}, include: [] }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, schemas, "Person", {
          fields: {
            Person: ["firstName", "age"],
            illustrated: ["title", "year"],
            authored: ["title", "year"],
          },
          include: ["illustrated", "authored"],
          sort: ["-created", "title", "user.name"],
          filter: [
            { field: "name", value: ["John", "Joan"], operator: "$eq" },
            { field: "age", value: 21, operator: "$eq" },
            { field: "employed", value: false, operator: "$eq" },
          ],
          page: { number: 3, size: 30 },
        }),
      ).toEqual(
        "?include=illustrated,authored&fields[Person]=firstName,age&fields[Book]=title,year&sort=-created,title,user.name&filter[name][]=John&filter[name][]=Joan&filter[age][$eq]=21&filter[employed][$eq]=false&page[number]=3&page[size]=30",
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
      expect(filterToQueryParam(undefined)).toEqual("")

      expect(
        filterToQueryParam("filter[name]=ABC&filter[completed]=true"),
      ).toEqual("filter[name]=ABC&filter[completed]=true")

      expect(
        filterToQueryParam([{ field: "name", value: "ABC", operator: "$eq" }]),
      ).toEqual("filter[name][$eq]=ABC")

      expect(
        filterToQueryParam([
          { field: "name", value: ["ABC", "DEF"], operator: "$eq" },
        ]),
      ).toEqual("filter[name][]=ABC&filter[name][]=DEF")

      expect(
        filterToQueryParam([
          { field: "completed", value: false, operator: "$eq" },
        ]),
      ).toEqual("filter[completed][$eq]=false")

      expect(
        filterToQueryParam([
          { field: "name", value: ["ABC", "DEF"], operator: "$eq" },
          { field: "count", value: 3, operator: "$eq" },
          { field: "completed", value: true, operator: "$eq" },
        ]),
      ).toEqual(
        "filter[name][]=ABC&filter[name][]=DEF&filter[count][$eq]=3&filter[completed][$eq]=true",
      )

      expect(
        filterToQueryParam([
          {
            field: "date",
            value: "2023-08-08T14:00",
            operator: "$eq",
          },
        ]),
      ).toEqual("filter[date][$eq]=2023-08-08T19%3A00%3A00.000Z")

      expect(
        filterToQueryParam([
          {
            field: "name",
            value: ["A'bc!*\"", "$()"],
            operator: "$eq",
          },
          { field: "count", value: 3, operator: "$eq" },
          { field: "completed", value: true, operator: "$eq" },
          { field: "employer", value: "(test$!)", operator: "$eq" },
        ]),
      ).toEqual(
        "filter[name][]=A'bc!*%22&filter[name][]=%24()&filter[count][$eq]=3&filter[completed][$eq]=true&filter[employer][$eq]=(test%24!)",
      )
    })
  })

  describe("pageToQueryParam", () => {
    it("works", () => {
      expect(pageToQueryParam({})).toEqual("")

      expect(pageToQueryParam("page[number]=3&page[size]=30")).toEqual(
        "page[number]=3&page[size]=30",
      )

      expect(pageToQueryParam({ number: 3, size: 30 })).toEqual(
        "page[number]=3&page[size]=30",
      )

      expect(pageToQueryParam([3, 30])).toEqual("page[number]=3&page[size]=30")

      expect(pageToQueryParam([3])).toEqual("page[number]=3")

      expect(pageToQueryParam([3, 30, 5])).toEqual(
        "page[number]=3&page[size]=30",
      )

      expect(pageToQueryParam(3)).toEqual("page[number]=3")
    })
  })
})

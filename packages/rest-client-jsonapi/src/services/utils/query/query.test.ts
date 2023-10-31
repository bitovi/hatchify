import { describe, expect, it } from "vitest"
import {
  fieldsToQueryParam,
  filterToQueryParam,
  getQueryParams,
  includeToQueryParam,
  isFields,
  pageToQueryParam,
  sortToQueryParam,
} from "./query"
import type { PartialSchema } from "@hatchifyjs/core"
import {
  assembler,
  belongsTo,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"

describe("rest-client-jsonapi/services/utils/query", () => {
  const partialSchemas = {
    Book: {
      name: "Book",
      attributes: {
        title: string(),
        year: integer(),
        date: string(),
      },
      relationships: {
        author: belongsTo("Person"),
        illustrators: hasMany("Person"),
        tags: hasMany("Namespaced_Tag"),
      },
    } satisfies PartialSchema,
    Person: {
      name: "Person",
      attributes: {
        name: string(),
        rating: integer(),
      },
      relationships: {
        authored: hasMany("Book"),
        illustrated: hasMany("Book"),
      },
    } satisfies PartialSchema,
    Namespaced_Tag: {
      name: "Tag",
      namespace: "Namespaced",
      attributes: {
        name: string(),
      },
    } satisfies PartialSchema,
  }
  const schemaMap = {
    Book: { type: "book_type", ...partialSchemas["Book"] },
    Person: { type: "person_type", ...partialSchemas["Person"] },
    Namespaced_Tag: {
      type: "Namespaced_Tag",
      ...partialSchemas["Namespaced_Tag"],
    },
  }
  const finalSchemas = assembler(partialSchemas)

  describe("fieldsToQueryParam", () => {
    it("works", () => {
      expect(() =>
        fieldsToQueryParam(schemaMap, finalSchemas, "Book", {
          Book: ["title", "body"],
          author: ["name", "email"],
          illustrators: ["name", "email"],
        }),
      ).toThrowError('"author" is not a valid schema')

      expect(() =>
        fieldsToQueryParam(schemaMap, finalSchemas, "Person", {
          Person: ["firstName", "age"],
          authored: ["title", "year"],
          illustrated: ["title", "year"],
        }),
      ).toThrowError('"authored" is not a valid schema')

      expect(() =>
        fieldsToQueryParam(schemaMap, finalSchemas, "Book", {
          Book: ["title"],
          tags: ["name"],
        }),
      ).toThrowError('"tags" is not a valid schema')

      expect(
        fieldsToQueryParam(schemaMap, finalSchemas, "Book", {
          Book: ["title"],
          Namespaced_Tag: ["name"],
        }),
      ).toEqual("fields[book_type]=title&fields[Namespaced_Tag]=name")

      expect(
        fieldsToQueryParam(schemaMap, finalSchemas, "Namespaced_Tag", {
          Namespaced_Tag: ["name"],
        }),
      ).toEqual("fields[Namespaced_Tag]=name")

      expect(fieldsToQueryParam(schemaMap, finalSchemas, "Book", {})).toEqual(
        "",
      )

      expect(
        fieldsToQueryParam(schemaMap, finalSchemas, "Book", {
          Book: ["title", "body"],
          Person: ["name", "email"],
        }),
      ).toEqual("fields[book_type]=title,body&fields[person_type]=name,email")
    })
  })

  describe("getQueryParams", () => {
    it("works for when include and fields have values", () => {
      expect(
        getQueryParams<typeof partialSchemas.Book>(
          schemaMap,
          finalSchemas,
          "Book",
          {
            fields: {
              Book: ["title", "body"],
              Person: ["name", "email"],
            },
            include: ["author", "illustrators"],
          },
        ),
      ).toEqual(
        "?include=author,illustrators&fields[book_type]=title,body&fields[person_type]=name,email",
      )

      expect(
        getQueryParams<typeof partialSchemas.Person>(
          schemaMap,
          finalSchemas,
          "Person",
          {
            fields: {
              Person: ["firstName", "age"],
              Book: ["title", "year"],
            },
            include: ["illustrated", "authored"],
          },
        ),
      ).toEqual(
        "?include=illustrated,authored&fields[person_type]=firstName,age&fields[book_type]=title,year",
      )

      expect(() =>
        getQueryParams(schemaMap, finalSchemas, "Person", {
          fields: {
            Person: ["firstName", "age"],
            authored: ["title", "year"],
          },
          include: ["illustrated", "authored"],
        }),
      ).toThrowError('"authored" is not a valid schema')
    })

    it("works for when fields has values and include is empty", () => {
      expect(
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: { Book: ["title", "body"] },
          include: [],
        }),
      ).toEqual("?fields[book_type]=title,body")

      expect(
        getQueryParams(schemaMap, finalSchemas, "Person", {
          fields: { Person: ["firstName", "age"] },
          include: [],
        }),
      ).toEqual("?fields[person_type]=firstName,age")
    })

    it("works when both fields and include are empty", () => {
      expect(
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: {},
          include: [],
        }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, finalSchemas, "Person", {
          fields: {},
          include: [],
        }),
      ).toEqual("")
    })

    it("works when sort is a string", () => {
      expect(
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: {},
          include: [],
        }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, finalSchemas, "Person", {
          fields: {},
          include: [],
          sort: "-created",
        }),
      ).toEqual("?sort=-created")
    })

    it("works when sort is an array of strings", () => {
      expect(
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: {},
          include: [],
        }),
      ).toEqual("")
      expect(
        getQueryParams(schemaMap, finalSchemas, "Person", {
          fields: {},
          include: [],
          sort: ["-created", "title", "user.name"],
        }),
      ).toEqual("?sort=-created,title,user.name")
    })

    it("works when include, fields, sort, filter, and page have values", () => {
      expect(
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: {},
          include: [],
        }),
      ).toEqual("")

      expect(() =>
        getQueryParams(schemaMap, finalSchemas, "Book", {
          fields: {
            Person: ["firstName", "age"],
            authored: ["title", "year"],
          },
          include: ["illustrated", "authored"],
          sort: ["-created", "title", "user.name"],
          filter: [
            { field: "name", value: ["John", "Joan"], operator: "$in" },
            { field: "age", value: 21, operator: "$eq" },
            { field: "employed", value: false, operator: "$eq" },
          ],
          page: { number: 3, size: 30 },
        }),
      ).toThrowError('"authored" is not a valid schema')

      expect(
        getQueryParams<typeof partialSchemas.Person>(
          schemaMap,
          finalSchemas,
          "Person",
          {
            fields: {
              Person: ["firstName", "age"],
              Book: ["title", "year"],
            },
            include: ["illustrated", "authored"],
            sort: ["-created", "title", "user.name"],
            filter: [
              { field: "name", value: ["John", "Joan"], operator: "$in" },
              { field: "age", value: 21, operator: "$eq" },
              { field: "employed", value: false, operator: "$eq" },
            ],
            page: { number: 3, size: 30 },
          },
        ),
      ).toEqual(
        "?include=illustrated,authored&fields[person_type]=firstName,age&fields[book_type]=title,year&sort=-created,title,user.name&filter[name][$in][]=John&filter[name][$in][]=Joan&filter[age][$eq]=21&filter[employed][$eq]=false&page[number]=3&page[size]=30",
      )
    })
  })

  describe("includeToQueryParam", () => {
    it("works", () => {
      expect(
        includeToQueryParam<typeof partialSchemas.Book>([
          "author",
          "illustrators",
        ]),
      ).toEqual("include=author,illustrators")

      expect(
        includeToQueryParam<typeof partialSchemas.Person>([
          "illustrated",
          "authored",
        ]),
      ).toEqual("include=illustrated,authored")
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
      // handles undefined
      expect(filterToQueryParam(undefined)).toEqual("")

      // handles string
      expect(
        filterToQueryParam("filter[name]=ABC&filter[completed]=true"),
      ).toEqual("filter[name]=ABC&filter[completed]=true")

      expect(filterToQueryParam("invalidFilter[name]=!#@$?")).toEqual(
        "invalidFilter[name]=!#@$?",
      )

      // handles arrays (from ui component)
      expect(
        filterToQueryParam([{ field: "name", value: "ABC", operator: "$eq" }]),
      ).toEqual("filter[name][$eq]=ABC")

      expect(
        filterToQueryParam([
          { field: "name", value: ["ABC", "DEF"], operator: "$in" },
        ]),
      ).toEqual("filter[name][$in][]=ABC&filter[name][$in][]=DEF")

      expect(
        filterToQueryParam([
          { field: "completed", value: false, operator: "$eq" },
        ]),
      ).toEqual("filter[completed][$eq]=false")

      expect(
        filterToQueryParam([
          { field: "name", value: ["ABC", "DEF"], operator: "$in" },
          { field: "count", value: 3, operator: "$eq" },
          { field: "completed", value: true, operator: "$eq" },
        ]),
      ).toEqual(
        "filter[name][$in][]=ABC&filter[name][$in][]=DEF&filter[count][$eq]=3&filter[completed][$eq]=true",
      )

      expect(
        filterToQueryParam([{ field: "name", value: "", operator: "empty" }]),
      ).toEqual("filter[name][$eq]=null")

      expect(
        filterToQueryParam([{ field: "name", value: "", operator: "nempty" }]),
      ).toEqual("filter[name][$ne]=null")

      expect(
        filterToQueryParam([
          {
            field: "date",
            value: "2023-08-08T14:00",
            operator: "$eq",
          },
        ]),
      ).toEqual("filter[date][$eq]=2023-08-08T14%3A00%3A00.000Z")

      expect(
        filterToQueryParam([
          {
            field: "date",
            value: "invalid-date",
            operator: "$eq",
          },
        ]),
      ).toEqual("filter[date][$eq]=invalid-date")

      expect(
        filterToQueryParam([
          {
            field: "name",
            value: ["A'bc!*\"", "$()"],
            operator: "$in",
          },
          { field: "count", value: 3, operator: "$eq" },
          { field: "completed", value: true, operator: "$eq" },
          { field: "employer", value: "(test$!)", operator: "$eq" },
        ]),
      ).toEqual(
        "filter[name][$in][]=A'bc!*%22&filter[name][$in][]=%24()&filter[count][$eq]=3&filter[completed][$eq]=true&filter[employer][$eq]=(test%24!)",
      )

      expect(
        filterToQueryParam([
          {
            field: "name",
            value: "Some",
            operator: "icontains",
          },
        ]),
      ).toEqual("filter[name][$ilike]=%25Some%25")

      expect(
        filterToQueryParam([
          {
            field: "name",
            value: "Some",
            operator: "istarts",
          },
        ]),
      ).toEqual("filter[name][$ilike]=Some%25")

      expect(
        filterToQueryParam([
          {
            field: "name",
            value: "Some",
            operator: "iends",
          },
        ]),
      ).toEqual("filter[name][$ilike]=%25Some")

      // handles objects
      expect(
        filterToQueryParam({
          name: {
            $eq: "ABC",
          },
        }),
      ).toEqual("filter[name][$eq]=ABC")

      expect(
        filterToQueryParam({
          name: {
            $eq: ["ABC", "DEF"],
          },
        }),
      ).toEqual("filter[name][$eq]=ABC%2CDEF")

      expect(
        filterToQueryParam({
          name: {
            $in: ["ABC", "DEF"],
          },
        }),
      ).toEqual("filter[name][$in][]=ABC&filter[name][$in][]=DEF")

      expect(
        filterToQueryParam({
          name: {
            empty: "",
          },
          count: {
            nempty: "",
            $ilike: [3, 4, 5],
          },
        }),
      ).toEqual(
        "filter[name][$eq]=null&filter[count][$ne]=null&filter[count][$ilike][]=3&filter[count][$ilike][]=4&filter[count][$ilike][]=5",
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

  describe("isFields", () => {
    it("works", () => {
      expect(isFields(null)).toEqual(false)
      expect(isFields(undefined)).toEqual(false)
      expect(isFields("title")).toEqual(false)
      expect(isFields(["title", "body"])).toEqual(false)
      expect(isFields({})).toEqual(true)
      expect(isFields({ Book: ["title", "body"] })).toEqual(true)
      expect(
        isFields({ Book: ["title", "body"], Person: ["name", "email"] }),
      ).toEqual(true)
    })
  })
})

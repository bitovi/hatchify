import { afterAll, describe, it, expect, vi } from "vitest"
import {
  HatchifyCoerceError,
  assembler,
  datetime,
  integer,
  string,
} from "@hatchifyjs/core"
import type { Resource } from "../../types"
import { testData, schemas } from "../../mocks/testData"
import {
  keyResourcesById,
  isMissingSchema,
  resourceToRecordRelationship,
  flattenResourcesIntoRecords,
  setClientPropertyValuesFromResponse,
  serializeClientPropertyValuesForRequest,
} from "./records"

describe("rest-client/utils/records", () => {
  describe("keyResourcesById", () => {
    it("should convert an array of resources to an object of resources keyed by id", () => {
      const resources: Resource[] = [
        { id: "1", __schema: "Entity", attributes: { name: "name-1" } },
        { id: "2", __schema: "Entity", attributes: { name: "name-2" } },
      ]

      expect(keyResourcesById(resources)).toEqual({
        "1": { id: "1", __schema: "Entity", attributes: { name: "name-1" } },
        "2": { id: "2", __schema: "Entity", attributes: { name: "name-2" } },
      })
    })
  })

  describe("isMissingSchema", () => {
    it("should return true if a schema is missing", () => {
      expect(
        isMissingSchema(schemas, { id: "article-1", __schema: "Foo" }),
      ).toBe(true)

      expect(
        isMissingSchema(schemas, [{ id: "article-1", __schema: "" }]),
      ).toBe(true)
    })

    it("should return false if a schema is not missing", () => {
      expect(
        isMissingSchema(schemas, { id: "person-1", __schema: "Person" }),
      ).toBe(false)

      expect(
        isMissingSchema(schemas, [{ id: "article-1", __schema: "Article" }]),
      ).toBe(false)
    })
  })

  describe("resourceToRecordRelationship", () => {
    it("works", () => {
      const finalSchemas = assembler({
        Person: {
          name: "Person",
          attributes: {
            name: string(),
          },
        },
      })

      const resource = {
        id: "person-1",
        __schema: "Person",
        attributes: {
          name: "Foo",
        },
      }

      const expected = {
        id: "person-1",
        __schema: "Person",
        __label: "Foo",
        name: "Foo",
      }

      expect(
        resourceToRecordRelationship(
          finalSchemas,
          { "person-1": resource },
          resource,
        ),
      ).toEqual(expected)
    })
  })

  describe("flattenResourcesIntoRecords", () => {
    it("works for many resources", () => {
      const expected = [
        {
          id: "article-1",
          __schema: "Article",
          title: "foo",
          body: "foo-body",
          author: {
            id: "person-1",
            __schema: "Person",
            __label: "foo",
            name: "foo",
          },
          tags: [
            { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
            { id: "tag-2", __schema: "Tag", __label: "tag-2", title: "tag-2" },
          ],
        },
        {
          id: "article-2",
          __schema: "Article",
          title: "foo",
          body: "foo-body",
          author: {
            id: "person-1",
            __schema: "Person",
            __label: "foo",
            name: "foo",
          },
          tags: [
            { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
          ],
        },
      ]

      expect(flattenResourcesIntoRecords(schemas, testData, "Article")).toEqual(
        expected,
      )
    })

    it("works for a single resource", () => {
      const expected = {
        id: "article-2",
        __schema: "Article",
        title: "foo",
        body: "foo-body",
        author: {
          id: "person-1",
          __schema: "Person",
          __label: "foo",
          name: "foo",
        },
        tags: [
          { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
        ],
      }

      expect(
        flattenResourcesIntoRecords(schemas, testData, "Article", "article-2"),
      ).toEqual(expected)
    })
  })

  describe("setClientPropertyValuesFromResponse", () => {
    const consoleMock = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined)

    afterAll(() => {
      consoleMock.mockReset()
    })

    const finalSchemas = assembler({
      Article: {
        name: "Article",
        attributes: {
          title: string({ required: true }),
          created: datetime({ step: "day" }),
          views: integer({ max: 1000 }),
        },
      },
    })

    it.only("works", () => {
      expect(
        setClientPropertyValuesFromResponse(finalSchemas, "Article", {
          title: "foo",
          created: "2021-01-01T00:00:00.000Z",
          views: 1,
        }),
      ).toEqual({
        title: "foo",
        created: new Date("2021-01-01T00:00:00.000Z"),
        views: 1,
      })

      expect(
        setClientPropertyValuesFromResponse(finalSchemas, "Article", {
          title: "bar",
          created: "2021-01-01T01:00:00.000Z",
          views: 500,
        }),
      ).toEqual({
        title: "bar",
        created: "2021-01-01T01:00:00.000Z",
        views: 500,
      })

      expect(consoleMock).toHaveBeenLastCalledWith(
        "Setting value `2021-01-01T01:00:00.000Z` on attribute `created`:",
        "as multiples of day",
      )

      expect(
        setClientPropertyValuesFromResponse(finalSchemas, "Article", {
          title: "bar",
          created: "2021-01-01T00:00:00.000Z",
          views: 1001,
        }),
      ).toEqual({
        title: "bar",
        created: new Date("2021-01-01T00:00:00.000Z"),
        views: 1001,
      })

      expect(consoleMock).toHaveBeenLastCalledWith(
        "Setting value `1001` on attribute `views`:",
        "less than or equal to 1000",
      )
    })
  })

  describe("serializeClientPropertyValuesForRequest", () => {
    it("works", () => {
      const partialSchemas = {
        Article: {
          name: "Article",
          attributes: {
            title: string({ required: true }),
            created: datetime({ step: "day" }),
            views: integer({ max: 1000 }),
          },
        },
      }
      const finalSchemas = assembler(partialSchemas)

      expect(
        serializeClientPropertyValuesForRequest<
          typeof partialSchemas,
          keyof typeof partialSchemas
        >(finalSchemas, "Article", {
          title: "foo",
          created: new Date("2021-01-01T00:00:00.000Z"),
          views: 1,
        }),
      ).toEqual({
        title: "foo",
        created: "2021-01-01T00:00:00.000Z",
        views: 1,
      })

      expect(() =>
        serializeClientPropertyValuesForRequest<
          typeof partialSchemas,
          keyof typeof partialSchemas
        >(finalSchemas, "Article", {
          title: "bar",
          created: new Date("2021-01-01T01:00:00.000Z"),
          views: 500,
        }),
      ).toThrow(new HatchifyCoerceError("as multiples of day"))

      expect(() =>
        serializeClientPropertyValuesForRequest<
          typeof partialSchemas,
          keyof typeof partialSchemas
        >(finalSchemas, "Article", {
          title: "bar",
          created: new Date("2021-01-01T00:00:00.000Z"),
          views: 1001,
        }),
      ).toThrow(new HatchifyCoerceError("less than or equal to 1000"))
    })
  })
})

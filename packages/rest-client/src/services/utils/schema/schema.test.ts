import { afterAll, describe, expect, it, vi } from "vitest"
import {
  HatchifyCoerceError,
  assembler,
  datetime,
  integer,
  string,
} from "@hatchifyjs/core"
import {
  schemaNameIsString,
  setClientPropertyValuesFromResponse,
  serializeClientPropertyValuesForRequest,
} from "./schema"

describe("rest-client/services/utils/schema", () => {
  describe("scehmaNameIsString", () => {
    it("works", () => {
      expect(schemaNameIsString("Foo")).toBe(true)
      expect(schemaNameIsString("Bar")).toBe(true)
      expect(schemaNameIsString(5)).toBe(false)
      expect(schemaNameIsString(true)).toBe(false)
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

    it("works", () => {
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

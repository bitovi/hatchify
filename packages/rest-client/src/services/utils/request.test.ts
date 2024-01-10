import { describe, expect, it } from "vitest"
import {
  HatchifyCoerceError,
  assembler,
  datetime,
  integer,
  string,
} from "@hatchifyjs/core"
import { serializeClientPropertyValuesForRequest } from "./request.js"

describe("rest-client/services/utils/request", () => {
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

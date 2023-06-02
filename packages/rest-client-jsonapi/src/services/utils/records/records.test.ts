import { describe, expect, it } from "vitest"
import { jsonApiResourceToRecord, convertToRecords } from "./records"

describe("rest-client-jsonapi/services/utils/records", () => {
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
})

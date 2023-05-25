import { describe, expect, it } from "vitest"
import { baseUrl } from "../../mocks/handlers"
import {
  jsonapi,
  fetchJsonApi,
  jsonApiResourceToRecord,
  convertToRecords,
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
})

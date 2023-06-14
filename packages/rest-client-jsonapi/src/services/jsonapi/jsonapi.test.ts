import { describe, expect, it } from "vitest"
import { baseUrl } from "../../mocks/handlers"
import { jsonapi } from "./jsonapi"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/jsonapi", () => {
  describe("jsonapi", () => {
    it("returns a Source", async () => {
      const dataSource = jsonapi(baseUrl, schemaMap)
      expect(dataSource).toEqual({
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })

    it("accepts a partial schemaMap", async () => {
      const dataSource = jsonapi(baseUrl, { Article: { endpoint: "articles" } })
      expect(dataSource).toEqual({
        version: 0,
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        createOne: expect.any(Function),
        updateOne: expect.any(Function),
        deleteOne: expect.any(Function),
      })
    })
  })
})

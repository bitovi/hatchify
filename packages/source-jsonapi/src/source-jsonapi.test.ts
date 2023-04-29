import { describe, expect, it } from "vitest"
import { getList } from "./source-jsonapi"
import { baseUrl, articles } from "../../shared/mocks/handlers"

describe("source-jsonapi", () => {
  describe("getList", () => {
    it("works", async () => {
      const result = await getList(
        {
          baseUrl,
          resource: "articles",
        },
        {},
      )

      expect(result).toEqual({ data: articles })
    })
  })
})

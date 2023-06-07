import { describe, expect, it } from "vitest"
import { baseUrl, testData } from "../../../mocks/handlers"
import { fetchJsonApi } from "./fetch"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/utils/fetch", () => {
  it("works", async () => {
    const data = await fetchJsonApi(
      "GET",
      `${baseUrl}/${schemaMap.Article.endpoint}`,
    )

    expect(data).toEqual({ data: testData.data, included: testData.included })
  })
})

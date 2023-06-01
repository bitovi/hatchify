import { describe, expect, it } from "vitest"
import { baseUrl } from "../../../mocks/handlers"
import { fetchJsonApi } from "./fetch"

const schemaMap = { Article: { type: "article", endpoint: "articles" } }

describe("rest-client-jsonapi/services/utils/fetch", () => {
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

import { describe, expect, it } from "vitest"
import { baseUrl } from "../../mocks/handlers"
import { jsonapi } from "./jsonapi"

const sourceConfig = { url: `${baseUrl}/articles`, type: "article" }

describe("source-jsonapi/services/jsonapi", () => {
  it("returns a Source", async () => {
    const dataSource = jsonapi(sourceConfig)
    expect(dataSource).toEqual({
      version: 0,
      getList: expect.any(Function),
      getOne: expect.any(Function),
      createOne: expect.any(Function),
    })
  })
})

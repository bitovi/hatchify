import { describe, expect, it } from "vitest"
import { getEndpoint } from "./schema"

describe("rest-client-jsonapi/services/utils/schema", () => {
  describe("getEndpoint", () => {
    it("works", () => {
      expect(getEndpoint("PluralName", "SingularName")).toEqual("plural-name")
      expect(getEndpoint(undefined, "SingularName")).toEqual("singular-names")
      expect(getEndpoint(undefined, "Todos")).toEqual("todoss")
      expect(getEndpoint(undefined, "Todo")).toEqual("todos")
    })
  })
})

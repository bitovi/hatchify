import { describe, expect, it } from "vitest"
import { getEndpoint } from "./schema"

describe("rest-client-jsonapi/services/utils/schema", () => {
  describe("getEndpoint", () => {
    it("works", () => {
      expect(getEndpoint("endpoint", "plural-name", "singular-name")).toEqual(
        "endpoint",
      )
      expect(getEndpoint("endpoint", undefined, "singular-name")).toEqual(
        "endpoint",
      )
      expect(getEndpoint(undefined, "PluralName", "SingularName")).toEqual(
        "plural-name",
      )
      expect(getEndpoint(undefined, undefined, "SingularName")).toEqual(
        "singular-names",
      )
      expect(getEndpoint(undefined, undefined, "Todos")).toEqual("todoss")
      expect(getEndpoint(undefined, undefined, "Todo")).toEqual("todos")
    })
  })
})

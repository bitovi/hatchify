import { describe, expect, it } from "vitest"
import { schemaNameIsString } from "./schema.js"

describe("rest-client/services/utils/schema", () => {
  describe("scehmaNameIsString", () => {
    it("works", () => {
      expect(schemaNameIsString("Foo")).toBe(true)
      expect(schemaNameIsString("Bar")).toBe(true)
      expect(schemaNameIsString(5)).toBe(false)
      expect(schemaNameIsString(true)).toBe(false)
    })
  })
})

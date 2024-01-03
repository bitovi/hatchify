import { coerce } from "./coerce.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Boolean" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Boolean", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Boolean", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-booleans", () => {
    expect(() => coerce("not a boolean", { type: "Boolean" })).toThrow(
      new HatchifyCoerceError("as a boolean"),
    )
    expect(() => coerce({}, { type: "Boolean" })).toThrow(
      new HatchifyCoerceError("as a boolean"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Boolean" },
      ),
    ).toThrow(new HatchifyCoerceError("as a boolean"))
  })
})

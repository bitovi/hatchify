import { coerce } from "./coerce"
import { HatchifyCoerceError } from "../../types"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "String" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "String", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "String", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "String" })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() => coerce({}, { type: "String" })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "String" },
      ),
    ).toThrow(new HatchifyCoerceError("as a string"))
  })

  it("handles boundaries", () => {
    expect(() => coerce("", { type: "String", min: 1 })).toThrow(
      new HatchifyCoerceError("with length greater than or equal to 1"),
    )
    expect(() =>
      coerce("a very long string", { type: "String", max: 10 }),
    ).toThrow(new HatchifyCoerceError("with length less than or equal to 10"))
  })
})

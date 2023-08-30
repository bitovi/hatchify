import { coerce } from "./coerce"
import { HatchifyCoerceError } from "../../types"

describe("coerce", () => {
  const values = ["foo", "bar"]

  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "String", values })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "String", allowNull: true, values })).toBeNull()
    expect(() =>
      coerce(null, { type: "String", allowNull: false, values }),
    ).toThrow(new HatchifyCoerceError("as a non-null value"))
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "String", values })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() => coerce({}, { type: "String", values })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "String", values },
      ),
    ).toThrow(new HatchifyCoerceError("as a string"))
  })

  it("handles values", () => {
    expect(() => coerce("baz", { type: "String", values })).toThrow(
      new HatchifyCoerceError("as one of 'foo', 'bar'"),
    )
  })
})

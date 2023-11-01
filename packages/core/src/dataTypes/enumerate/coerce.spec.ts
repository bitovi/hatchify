import { coerce } from "./coerce"
import { HatchifyCoerceError } from "../../types"

describe("coerce", () => {
  const values = ["foo", "bar"]

  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "enum", values })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "enum", allowNull: true, values })).toBeNull()
    expect(() =>
      coerce(null, { type: "enum", allowNull: false, values }),
    ).toThrow(new HatchifyCoerceError("as a non-null value"))
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "enum", values })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() => coerce({}, { type: "enum", values })).toThrow(
      new HatchifyCoerceError("as a string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "enum", values },
      ),
    ).toThrow(new HatchifyCoerceError("as a string"))
  })

  it("handles values", () => {
    expect(() => coerce("baz", { type: "enum", values })).toThrow(
      new HatchifyCoerceError("as one of 'foo', 'bar'"),
    )
  })
})

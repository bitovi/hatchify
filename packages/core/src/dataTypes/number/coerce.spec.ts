import { coerce } from "./coerce.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Number" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Number", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Number", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-numbers", () => {
    expect(() => coerce("not a number", { type: "Number" })).toThrow(
      new HatchifyCoerceError("as a number"),
    )
    expect(() => coerce({}, { type: "Number" })).toThrow(
      new HatchifyCoerceError("as a number"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Number" },
      ),
    ).toThrow(new HatchifyCoerceError("as a number"))
  })

  it("handles infinity", () => {
    expect(() => coerce(Infinity, { type: "Number" })).toThrow(
      new HatchifyCoerceError("different than Infinity"),
    )
    expect(() => coerce(-Infinity, { type: "Number" })).toThrow(
      new HatchifyCoerceError("different than Infinity"),
    )
  })

  it("handles unsafe integers", () => {
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(() => coerce(9999999999999999, { type: "Number" })).toThrow(
      new HatchifyCoerceError("within safe integer range"),
    )
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    expect(() => coerce(-9999999999999999, { type: "Number" })).toThrow(
      new HatchifyCoerceError("within safe integer range"),
    )
  })

  it("handles boundaries", () => {
    expect(() => coerce(-1, { type: "Number", min: 0 })).toThrow(
      new HatchifyCoerceError("greater than or equal to 0"),
    )
    expect(() => coerce(1, { type: "Number", max: 0 })).toThrow(
      new HatchifyCoerceError("less than or equal to 0"),
    )
  })

  it("handles steps", () => {
    expect(() => coerce(1, { type: "Number", step: 2 })).toThrow(
      new HatchifyCoerceError("as multiples of 2"),
    )
  })
})

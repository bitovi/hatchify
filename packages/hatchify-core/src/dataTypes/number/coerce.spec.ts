import { coerce } from "./coerce"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Number" })).toThrow(
      new Error("Non-undefined value is required"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Number", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Number", allowNull: false })).toThrow(
      new Error("Non-null value is required"),
    )
  })

  it("handles non-numbers", () => {
    expect(() => coerce("not a number", { type: "Number" })).toThrow(
      new Error("Provided value is not a number"),
    )
    expect(() => coerce({}, { type: "Number" })).toThrow(
      new Error("Provided value is not a number"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Number" },
      ),
    ).toThrow(new Error("Provided value is not a number"))
  })

  it("handles infinity", () => {
    expect(() => coerce(Infinity, { type: "Number" })).toThrow(
      new Error("Infinity as a value is not supported"),
    )
    expect(() => coerce(-Infinity, { type: "Number" })).toThrow(
      new Error("Infinity as a value is not supported"),
    )
  })

  it("handles boundaries", () => {
    expect(() => coerce(-1, { type: "Number", min: 0 })).toThrow(
      new Error("Provided value is lower than the minimum of 0"),
    )
    expect(() => coerce(1, { type: "Number", max: 0 })).toThrow(
      new Error("Provided value is higher than the maximum of 0"),
    )
  })

  it("handles steps", () => {
    expect(() => coerce(1, { type: "Number", step: 2 })).toThrow(
      new Error("Provided value violates the step of 2"),
    )
  })
})

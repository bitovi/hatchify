import { coerce } from "./coerce.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Datetime", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Datetime", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce({}, { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Datetime" },
      ),
    ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
  })

  it("handles non-datetime strings", () => {
    expect(() => coerce("", { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("invalid date", { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("2023-01-01", { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("1/1/2023", { type: "Datetime" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
  })

  it("handles boundaries", () => {
    expect(() =>
      coerce(new Date("2022-12-31T00:00:00.000Z"), {
        type: "Datetime",
        min: new Date("2023-01-01"),
      }),
    ).toThrow(new HatchifyCoerceError("after or on 2023-01-01T00:00:00.000Z"))
    expect(() =>
      coerce(new Date("2023-12-02T00:00:00.000Z"), {
        type: "Datetime",
        max: new Date("2023-01-01"),
      }),
    ).toThrow(new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"))
  })

  it("handles steps", () => {
    expect(() =>
      coerce(new Date("2023-01-01T01:00:00.000Z"), {
        type: "Datetime",
        step: "day",
      }),
    ).toThrow(new HatchifyCoerceError("as multiples of day"))
  })
})

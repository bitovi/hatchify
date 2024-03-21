import { coerce } from "./coerce.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Date" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Date", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Date", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce({}, { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Date" },
      ),
    ).toThrow(new HatchifyCoerceError("as an ISO 8601 date and time string"))
  })

  it("handles non-datetime strings", () => {
    expect(() => coerce("", { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("invalid date", { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("2023-01-01", { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
    expect(() => coerce("1/1/2023", { type: "Date" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date and time string"),
    )
  })

  it("handles boundaries", () => {
    expect(() =>
      coerce(new Date("2022-12-31T00:00:00.000Z"), {
        type: "Date",
        min: new Date("2023-01-01"),
      }),
    ).toThrow(new HatchifyCoerceError("after or on 2023-01-01T00:00:00.000Z"))
    expect(() =>
      coerce(new Date("2023-12-02T00:00:00.000Z"), {
        type: "Date",
        max: new Date("2023-01-01"),
      }),
    ).toThrow(new HatchifyCoerceError("before or on 2023-01-01T00:00:00.000Z"))
  })

  it("handles steps", () => {
    expect(() =>
      coerce(new Date("2023-01-01T01:00:00.000Z"), {
        type: "Date",
        step: "day",
      }),
    ).toThrow(new HatchifyCoerceError("as multiples of day"))
  })
})

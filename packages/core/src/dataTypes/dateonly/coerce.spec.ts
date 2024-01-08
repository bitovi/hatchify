import { coerce } from "./coerce.js"
import { HatchifyCoerceError } from "../../types/index.js"

describe("coerce", () => {
  it("handles undefined", () => {
    expect(() => coerce(undefined, { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as a non-undefined value"),
    )
  })

  it("handles null", () => {
    expect(coerce(null, { type: "Dateonly", allowNull: true })).toBeNull()
    expect(() => coerce(null, { type: "Dateonly", allowNull: false })).toThrow(
      new HatchifyCoerceError("as a non-null value"),
    )
  })

  it("handles non-strings", () => {
    expect(() => coerce(1, { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date string"),
    )
    expect(() => coerce({}, { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date string"),
    )
    expect(() =>
      coerce(
        () => {
          /* noop */
        },
        { type: "Dateonly" },
      ),
    ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))
  })

  it("handles non-dateonly strings", () => {
    expect(() => coerce("", { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date string"),
    )
    expect(() => coerce("invalid date", { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date string"),
    )
    expect(() =>
      coerce("2023-01-01T00:00:00.000Z", { type: "Dateonly" }),
    ).toThrow(new HatchifyCoerceError("as an ISO 8601 date string"))
    expect(() => coerce("1/1/2023", { type: "Dateonly" })).toThrow(
      new HatchifyCoerceError("as an ISO 8601 date string"),
    )
  })

  it("handles boundaries", () => {
    expect(() =>
      coerce("2022-12-31", {
        type: "Dateonly",
        min: "2023-01-01",
      }),
    ).toThrow(new HatchifyCoerceError("after or on 2023-01-01"))
    expect(() =>
      coerce("2023-12-02", {
        type: "Dateonly",
        max: "2023-01-01",
      }),
    ).toThrow(new HatchifyCoerceError("before or on 2023-01-01"))
  })
})

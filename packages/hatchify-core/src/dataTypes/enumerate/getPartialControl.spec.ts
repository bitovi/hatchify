import { getPartialControl } from "./getPartialControl"
import type { PartialEnumProps } from "./types"
import { HatchifyInvalidInputError } from "../../types"

describe("getPartialControl", () => {
  const values = ["foo", "bar"]

  it("handles required", () => {
    expect(
      getPartialControl({ values, required: undefined }).allowNull,
    ).toBeUndefined()
    expect(
      getPartialControl({ values, required: null as unknown as boolean })
        .allowNull,
    ).toBeNull()
    expect(getPartialControl({ values, required: true }).allowNull).toBe(false)
    expect(getPartialControl({ values, required: false }).allowNull).toBe(true)
  })

  it("handles primary", () => {
    expect(
      getPartialControl({ values, primary: undefined }).primary,
    ).toBeUndefined()
    expect(
      getPartialControl({ values, primary: null as unknown as boolean })
        .primary,
    ).toBeNull()
    expect(getPartialControl({ values, primary: true }).primary).toBe(true)
    expect(getPartialControl({ values, primary: false }).primary).toBe(false)
  })

  it("handles invalid values", () => {
    expect(() => getPartialControl({} as unknown as PartialEnumProps)).toThrow(
      new HatchifyInvalidInputError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialControl({ values: null } as unknown as PartialEnumProps),
    ).toThrow(
      new HatchifyInvalidInputError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialControl({ values: 1 } as unknown as PartialEnumProps),
    ).toThrow(
      new HatchifyInvalidInputError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialControl({ values: "foo" } as unknown as PartialEnumProps),
    ).toThrow(
      new HatchifyInvalidInputError(
        "enum must be called with values as a non-empty string array",
      ),
    )
    expect(() =>
      getPartialControl({ values: [] } as unknown as PartialEnumProps),
    ).toThrow(
      new HatchifyInvalidInputError(
        "enum must be called with values as a non-empty string array",
      ),
    )
  })
})

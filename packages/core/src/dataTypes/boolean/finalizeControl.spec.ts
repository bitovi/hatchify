import { finalizeControl } from "./finalizeControl.js"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "Boolean", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "Boolean",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Boolean", allowNull: true }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Boolean", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "Boolean", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({
        type: "Boolean",
        primary: null as unknown as boolean,
      }).primary,
    ).toBe(false)
    expect(finalizeControl({ type: "Boolean", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "Boolean", primary: false }).primary).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "Boolean", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "Boolean", default: null }).default,
    ).toBeNull()
    expect(finalizeControl({ type: "Boolean", default: true }).default).toBe(
      true,
    )

    const func = () => false

    expect(finalizeControl({ type: "Boolean", default: func }).default).toEqual(
      func,
    )
  })
})

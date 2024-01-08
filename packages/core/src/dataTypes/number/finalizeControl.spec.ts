import { finalizeControl } from "./finalizeControl.js"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "Number", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Number", allowNull: null as unknown as boolean })
        .allowNull,
    ).toBe(true)
    expect(finalizeControl({ type: "Number", allowNull: true }).allowNull).toBe(
      true,
    )
    expect(
      finalizeControl({ type: "Number", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "Number", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "Number", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "Number", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "Number", primary: false }).primary).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "Number", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "Number", default: null }).default,
    ).toBeNull()
    expect(finalizeControl({ type: "Number", default: 1 }).default).toBe(1)

    const func = () => 1

    expect(finalizeControl({ type: "Number", default: func }).default).toEqual(
      func,
    )
  })
})

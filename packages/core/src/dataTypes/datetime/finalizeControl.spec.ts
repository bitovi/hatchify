import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "Datetime", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "Datetime",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Datetime", allowNull: true }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Datetime", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "Datetime", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "Datetime", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "Datetime", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "Datetime", primary: false }).primary).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "Datetime", default: undefined }).default,
    ).toBeNull()
    expect(
      finalizeControl({ type: "Datetime", default: null }).default,
    ).toBeNull()

    const now = new Date()

    expect(finalizeControl({ type: "Datetime", default: now }).default).toBe(
      now,
    )

    const func = () => now

    expect(
      finalizeControl({ type: "Datetime", default: func }).default,
    ).toEqual(func)
  })
})

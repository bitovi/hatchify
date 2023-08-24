import { finalizeControl } from "./finalizeControl"

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
})

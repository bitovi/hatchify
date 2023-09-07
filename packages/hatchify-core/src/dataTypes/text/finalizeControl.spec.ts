import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "String", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "String", allowNull: null as unknown as boolean })
        .allowNull,
    ).toBe(true)
    expect(finalizeControl({ type: "String", allowNull: true }).allowNull).toBe(
      true,
    )
    expect(
      finalizeControl({ type: "String", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "String", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "String", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "String", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "String", primary: false }).primary).toBe(
      false,
    )
  })
})

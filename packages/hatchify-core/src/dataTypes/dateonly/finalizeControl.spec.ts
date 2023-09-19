import { finalizeControl } from "./finalizeControl"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "Dateonly", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "Dateonly",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Dateonly", allowNull: true }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({ type: "Dateonly", allowNull: false }).allowNull,
    ).toBe(false)
  })

  it("handles primary", () => {
    expect(
      finalizeControl({ type: "Dateonly", primary: undefined }).primary,
    ).toBe(false)
    expect(
      finalizeControl({ type: "Dateonly", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "Dateonly", primary: true }).primary).toBe(
      true,
    )
    expect(finalizeControl({ type: "Dateonly", primary: false }).primary).toBe(
      false,
    )
  })
})

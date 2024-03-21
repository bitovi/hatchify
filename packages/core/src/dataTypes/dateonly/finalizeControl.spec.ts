import { finalizeControl } from "./finalizeControl.js"

describe("finalizeControl", () => {
  it("handles allowNull", () => {
    expect(
      finalizeControl({ type: "Date", allowNull: undefined }).allowNull,
    ).toBe(true)
    expect(
      finalizeControl({
        type: "Date",
        allowNull: null as unknown as boolean,
      }).allowNull,
    ).toBe(true)
    expect(finalizeControl({ type: "Date", allowNull: true }).allowNull).toBe(
      true,
    )
    expect(finalizeControl({ type: "Date", allowNull: false }).allowNull).toBe(
      false,
    )
  })

  it("handles primary", () => {
    expect(finalizeControl({ type: "Date", primary: undefined }).primary).toBe(
      false,
    )
    expect(
      finalizeControl({ type: "Date", primary: null as unknown as boolean })
        .primary,
    ).toBe(false)
    expect(finalizeControl({ type: "Date", primary: true }).primary).toBe(true)
    expect(finalizeControl({ type: "Date", primary: false }).primary).toBe(
      false,
    )
  })

  it("handles default", () => {
    expect(
      finalizeControl({ type: "Date", default: undefined }).default,
    ).toBeNull()
    expect(finalizeControl({ type: "Date", default: null }).default).toBeNull()
    expect(
      finalizeControl({ type: "Date", default: "1970-01-01" }).default,
    ).toBe("1970-01-01")

    const func = () => "1970-01-01"

    expect(finalizeControl({ type: "Date", default: func }).default).toEqual(
      func,
    )
  })
})

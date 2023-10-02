import { finalizeControl } from "./finalizeControl"

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

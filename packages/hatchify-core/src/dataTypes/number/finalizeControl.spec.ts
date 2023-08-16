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

  describe("handles validate", () => {
    it("handles min", () => {
      expect(
        finalizeControl({ type: "Number", min: undefined, max: 0 }).min,
      ).toBe(-Infinity)
      expect(
        finalizeControl({
          type: "Number",
          min: null as unknown as number,
          max: 0,
        }).min,
      ).toBe(-Infinity)
      expect(finalizeControl({ type: "Number", min: 0, max: 0 }).min).toBe(0)
    })

    it("handles max", () => {
      expect(
        finalizeControl({ type: "Number", min: 0, max: undefined }).max,
      ).toBe(Infinity)
      expect(
        finalizeControl({
          type: "Number",
          min: 0,
          max: null as unknown as number,
        }).max,
      ).toBe(Infinity)
      expect(finalizeControl({ type: "Number", min: 0, max: 0 }).max).toBe(0)
    })
  })
})

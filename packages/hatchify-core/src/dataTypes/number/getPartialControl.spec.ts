import { getPartialControl } from "./getPartialControl"

describe("getPartialControl", () => {
  it("handles required", () => {
    expect(getPartialControl({ required: undefined }).allowNull).toBeUndefined()
    expect(
      getPartialControl({ required: null as unknown as boolean }).allowNull,
    ).toBeNull()
    expect(getPartialControl({ required: true }).allowNull).toBe(false)
    expect(getPartialControl({ required: false }).allowNull).toBe(true)
  })

  it("handles primary", () => {
    expect(getPartialControl({ primary: undefined }).primary).toBeUndefined()
    expect(
      getPartialControl({ primary: null as unknown as boolean }).primary,
    ).toBeNull()
    expect(getPartialControl({ primary: true }).primary).toBe(true)
    expect(getPartialControl({ primary: false }).primary).toBe(false)
  })

  describe("handles validate", () => {
    it("handles min", () => {
      expect(getPartialControl({ min: undefined, max: 0 }).min).toBeUndefined()
      expect(
        getPartialControl({ min: null as unknown as number, max: 0 }).min,
      ).toBeNull()
      expect(getPartialControl({ min: 0, max: 0 }).min).toBe(0)
    })

    it("handles max", () => {
      expect(getPartialControl({ min: 0, max: undefined }).max).toBeUndefined()
      expect(
        getPartialControl({ min: 0, max: null as unknown as number }).max,
      ).toBeNull()
      expect(getPartialControl({ min: 0, max: 0 }).max).toBe(0)
    })
  })
})

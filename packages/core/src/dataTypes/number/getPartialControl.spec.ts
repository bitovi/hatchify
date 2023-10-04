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

  it("handles default", () => {
    expect(getPartialControl({ default: undefined }).default).toBeUndefined()
    expect(getPartialControl({ default: null }).default).toBeNull()
    expect(getPartialControl({ default: 1 }).default).toBe(1)

    const func = () => 1

    expect(getPartialControl({ default: func }).default).toEqual(func)
  })
})

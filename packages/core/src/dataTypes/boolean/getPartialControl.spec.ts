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

  it("handles default", () => {
    expect(getPartialControl({ default: undefined }).default).toBeUndefined()
    expect(getPartialControl({ default: null }).default).toBeNull()
    expect(getPartialControl({ default: true }).default).toBe(true)

    const func = () => false

    expect(getPartialControl({ default: func }).default).toEqual(func)
  })
})

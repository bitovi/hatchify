import { getPartialOrm } from "./getPartialOrm.js"

describe("getPartialOrm", () => {
  it("handles required", () => {
    expect(
      getPartialOrm({ required: undefined }).sequelize.allowNull,
    ).toBeUndefined()
    expect(
      getPartialOrm({ required: null as unknown as boolean }).sequelize
        .allowNull,
    ).toBeNull()
    expect(getPartialOrm({ required: true }).sequelize.allowNull).toBe(false)
    expect(getPartialOrm({ required: false }).sequelize.allowNull).toBe(true)
  })

  it("handles default", () => {
    expect(
      getPartialOrm({ default: undefined }).sequelize.defaultValue,
    ).toBeUndefined()
    expect(getPartialOrm({ default: null }).sequelize.defaultValue).toBeNull()
    expect(getPartialOrm({ default: false }).sequelize.defaultValue).toBe(false)

    const func = () => true

    expect(getPartialOrm({ default: func }).sequelize.defaultValue).toEqual(
      func,
    )
  })

  it("handles unique", () => {
    expect(
      getPartialOrm({ unique: undefined }).sequelize.unique,
    ).toBeUndefined()
    expect(
      getPartialOrm({ unique: null as unknown as boolean }).sequelize.unique,
    ).toBeNull()
    expect(getPartialOrm({ unique: true }).sequelize.unique).toBe(true)
    expect(getPartialOrm({ unique: false }).sequelize.unique).toBe(false)
  })
})

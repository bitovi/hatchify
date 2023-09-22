import { getPartialOrm } from "./getPartialOrm"

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

  it("handles autoIncrement", () => {
    expect(
      getPartialOrm({ autoIncrement: undefined }).sequelize.autoIncrement,
    ).toBeUndefined()
    expect(
      getPartialOrm({ autoIncrement: null as unknown as boolean }).sequelize
        .autoIncrement,
    ).toBeNull()
    expect(getPartialOrm({ autoIncrement: true }).sequelize.autoIncrement).toBe(
      true,
    )
    expect(
      getPartialOrm({ autoIncrement: false }).sequelize.autoIncrement,
    ).toBe(false)
  })

  it("handles primaryKey", () => {
    expect(
      getPartialOrm({ primary: undefined }).sequelize.primaryKey,
    ).toBeUndefined()
    expect(
      getPartialOrm({ primary: null as unknown as boolean }).sequelize
        .primaryKey,
    ).toBeNull()
    expect(getPartialOrm({ primary: true }).sequelize.primaryKey).toBe(true)
    expect(getPartialOrm({ primary: false }).sequelize.primaryKey).toBe(false)
  })

  it("handles default", () => {
    expect(
      getPartialOrm({ default: undefined }).sequelize.defaultValue,
    ).toBeUndefined()
    expect(getPartialOrm({ default: null }).sequelize.defaultValue).toBeNull()
    expect(getPartialOrm({ default: 1 }).sequelize.defaultValue).toBe(1)

    const func = () => 1

    expect(getPartialOrm({ default: func }).sequelize.defaultValue).toEqual(
      func,
    )
  })
})

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
    expect(getPartialOrm({ default: "test" }).sequelize.defaultValue).toBe(
      "test",
    )

    const func = () => "test"

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

  it("handles typeArgs", () => {
    expect(getPartialOrm().sequelize.typeArgs).toEqual([])
    expect(getPartialOrm({}).sequelize.typeArgs).toEqual([])
    expect(getPartialOrm({ max: undefined }).sequelize.typeArgs).toEqual([])
    expect(
      getPartialOrm({ max: null as unknown as number }).sequelize.typeArgs,
    ).toEqual([])
    expect(getPartialOrm({ max: 0 }).sequelize.typeArgs).toEqual([0])
    expect(getPartialOrm({ max: 25 }).sequelize.typeArgs).toEqual([25])
    expect(getPartialOrm({ max: 255 }).sequelize.typeArgs).toEqual([255])
    expect(getPartialOrm({ max: 1000 }).sequelize.typeArgs).toEqual([1000])
  })
})

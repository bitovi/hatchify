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

  describe("handles validate", () => {
    it("handles min", () => {
      expect(
        getPartialOrm({ min: undefined, max: 0 }).sequelize.validate.min,
      ).toBeUndefined()
      expect(
        getPartialOrm({ min: null as unknown as number, max: 0 }).sequelize
          .validate.min,
      ).toBeNull()
      expect(getPartialOrm({ min: 0, max: 0 }).sequelize.validate.min).toBe(0)
    })

    it("handles max", () => {
      expect(
        getPartialOrm({ min: 0, max: undefined }).sequelize.validate.max,
      ).toBeUndefined()
      expect(
        getPartialOrm({ min: 0, max: null as unknown as number }).sequelize
          .validate.max,
      ).toBeNull()
      expect(getPartialOrm({ min: 0, max: 0 }).sequelize.validate.max).toBe(0)
    })
  })
})

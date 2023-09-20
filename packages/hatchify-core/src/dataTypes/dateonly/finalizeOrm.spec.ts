import { finalizeOrm } from "./finalizeOrm"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          allowNull: false,
        },
      }).sequelize.allowNull,
    ).toBe(false)
  })

  it("handles primaryKey", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          primaryKey: false,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          defaultValue: undefined,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          defaultValue: null,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          defaultValue: "1970-01-01",
        },
      }).sequelize.defaultValue,
    ).toBe("1970-01-01")

    const func = () => "1970-01-01"

    expect(
      finalizeOrm({
        sequelize: {
          type: "DATEONLY",
          typeArgs: [],
          defaultValue: func,
        },
      }).sequelize.defaultValue,
    ).toEqual(func)
  })
})

import { finalizeOrm } from "./finalizeOrm.js"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
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
          type: "DECIMAL",
          typeArgs: [],
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
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
          type: "DECIMAL",
          typeArgs: [],
          defaultValue: undefined,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          defaultValue: null,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          defaultValue: 1,
        },
      }).sequelize.defaultValue,
    ).toBe(1)

    const func = () => 1

    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          defaultValue: func,
        },
      }).sequelize.defaultValue,
    ).toEqual(func)
  })

  it("handles unique", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          unique: undefined,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          unique: null as unknown as boolean,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          unique: true,
        },
      }).sequelize.unique,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DECIMAL",
          typeArgs: [],
          unique: false,
        },
      }).sequelize.unique,
    ).toBe(false)
  })
})

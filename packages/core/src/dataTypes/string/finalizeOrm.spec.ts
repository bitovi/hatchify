import { finalizeOrm } from "./finalizeOrm.js"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
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
          type: "STRING",
          typeArgs: [],
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
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
          type: "STRING",
          typeArgs: [],
          defaultValue: undefined,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          defaultValue: null,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          defaultValue: "test",
        },
      }).sequelize.defaultValue,
    ).toBe("test")

    const func = () => "test"

    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
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
          type: "STRING",
          typeArgs: [],
          unique: undefined,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          unique: null as unknown as boolean,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          unique: true,
        },
      }).sequelize.unique,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
          unique: false,
        },
      }).sequelize.unique,
    ).toBe(false)
  })

  it("handles typeArgs", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [],
        },
      }).sequelize.typeArgs,
    ).toEqual([255])
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [0],
        },
      }).sequelize.typeArgs,
    ).toEqual([0])
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [25],
        },
      }).sequelize.typeArgs,
    ).toEqual([25])
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [255],
        },
      }).sequelize.typeArgs,
    ).toEqual([255])
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: [1000],
        },
      }).sequelize.typeArgs,
    ).toEqual([1000])
  })
})

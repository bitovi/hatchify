import { finalizeOrm } from "./finalizeOrm"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
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
          type: "String",
          typeArgs: [],
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
          primaryKey: false,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
  })

  it("handles typeArgs", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [],
        },
      }).sequelize.typeArgs,
    ).toEqual([255])
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [0],
        },
      }).sequelize.typeArgs,
    ).toEqual([0])
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [25],
        },
      }).sequelize.typeArgs,
    ).toEqual([25])
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [255],
        },
      }).sequelize.typeArgs,
    ).toEqual([255])
    expect(
      finalizeOrm({
        sequelize: {
          type: "String",
          typeArgs: [1000],
        },
      }).sequelize.typeArgs,
    ).toEqual([1000])
  })
})

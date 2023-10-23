import { finalizeOrm } from "./finalizeOrm"

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
          defaultValue: "foo",
        },
      }).sequelize.defaultValue,
    ).toBe("foo")

    const func = () => "bar"

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
          typeArgs: ["foo"],
        },
      }).sequelize.typeArgs,
    ).toEqual(["foo"])
    expect(
      finalizeOrm({
        sequelize: {
          type: "STRING",
          typeArgs: ["foo", "bar"],
        },
      }).sequelize.typeArgs,
    ).toEqual(["foo", "bar"])
  })
})

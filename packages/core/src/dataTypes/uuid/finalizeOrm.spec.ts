import { finalizeOrm } from "./finalizeOrm.js"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          allowNull: false,
        },
      }).sequelize.allowNull,
    ).toBe(false)
  })

  it("handles primaryKey", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          primaryKey: false,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          defaultValue: undefined,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          defaultValue: null,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          defaultValue: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
        },
      }).sequelize.defaultValue,
    ).toBe("6ca2929f-c66d-4542-96a9-f1a6aa3d2678")

    const func = () => "6ca2929f-c66d-4542-96a9-f1a6aa3d2678"

    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          defaultValue: func,
        },
      }).sequelize.defaultValue,
    ).toEqual(func)
  })

  it("handles unique", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          unique: undefined,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          unique: null as unknown as boolean,
        },
      }).sequelize.unique,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          unique: true,
        },
      }).sequelize.unique,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "UUID",
          unique: false,
        },
      }).sequelize.unique,
    ).toBe(false)
  })
})

import { finalizeOrm } from "./finalizeOrm"

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
})

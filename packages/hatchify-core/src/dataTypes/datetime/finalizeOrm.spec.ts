import { finalizeOrm } from "./finalizeOrm"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
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
          type: "DATE",
          typeArgs: [],
          primaryKey: undefined,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          primaryKey: null as unknown as boolean,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          primaryKey: true,
        },
      }).sequelize.primaryKey,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "DATE",
          typeArgs: [],
          primaryKey: false,
        },
      }).sequelize.primaryKey,
    ).toBe(false)
  })
})

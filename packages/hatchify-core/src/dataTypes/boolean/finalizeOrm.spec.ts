import { finalizeOrm } from "./finalizeOrm"

describe("finalizeOrm", () => {
  it("handles allowNull", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          allowNull: undefined,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          allowNull: null as unknown as boolean,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          allowNull: true,
        },
      }).sequelize.allowNull,
    ).toBe(true)
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          allowNull: false,
        },
      }).sequelize.allowNull,
    ).toBe(false)
  })

  it("handles default", () => {
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          defaultValue: undefined,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          defaultValue: null,
        },
      }).sequelize.defaultValue,
    ).toBeNull()
    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          defaultValue: true,
        },
      }).sequelize.defaultValue,
    ).toBe(true)

    const func = () => false

    expect(
      finalizeOrm({
        sequelize: {
          type: "BOOLEAN",
          defaultValue: func,
        },
      }).sequelize.defaultValue,
    ).toEqual(func)
  })
})

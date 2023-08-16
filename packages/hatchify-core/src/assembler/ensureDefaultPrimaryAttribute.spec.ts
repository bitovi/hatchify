import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute"
import { integer } from "../dataTypes"

describe("ensureDefaultPrimaryAttribute", () => {
  it("handles existing primary attribute", () => {
    expect(
      ensureDefaultPrimaryAttribute({
        name: "Todo",
        id: integer({ required: true, autoIncrement: true }),
        attributes: {},
      }),
    ).toEqual({
      name: "Todo",
      id: {
        name: 'integer({"required":true,"autoIncrement":true})',
        control: {
          type: "Number",
          allowNull: false,
          min: undefined,
          max: undefined,
          primary: true,
          step: 1,
        },
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
        },
        finalize: expect.any(Function),
      },
      attributes: {},
    })
  })

  it("handles non-existing primary attribute", () => {
    expect(
      ensureDefaultPrimaryAttribute({
        name: "Todo",
        attributes: {},
      }),
    ).toEqual({
      name: "Todo",
      id: {
        name: 'integer({"primary":true,"autoIncrement":true,"required":true,"min":1})',
        control: {
          type: "Number",
          allowNull: false,
          min: 1,
          max: undefined,
          primary: true,
          step: 1,
        },
        orm: {
          sequelize: {
            type: "INTEGER",
            typeArgs: [],
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
        },
        finalize: expect.any(Function),
      },
      attributes: {},
    })
  })
})

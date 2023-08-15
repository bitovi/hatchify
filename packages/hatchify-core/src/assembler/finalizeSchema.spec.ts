import { finalizeSchema } from "./finalizeSchema"
import { integer } from "../dataTypes"

describe("finalizeSchema", () => {
  it("finalizes a partial schema", () => {
    expect(
      finalizeSchema({
        name: "Todo",
        id: integer({ required: true, autoIncrement: true }),
        attributes: {
          importance: integer({ min: 0 }),
        },
      }),
    ).toEqual({
      name: "Todo",
      id: {
        name: 'integer({"required":true,"autoIncrement":true})',
        control: {
          allowNull: false,
          max: Infinity,
          min: -Infinity,
          primary: false,
          step: 1,
          type: "Number",
        },
        orm: {
          sequelize: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: false,
            type: "INTEGER",
            typeArgs: [],
          },
        },
        serializeORMPropertyValue: expect.any(Function),
        setORMPropertyValue: expect.any(Function),
        setORMQueryFilterValue: expect.any(Function),
      },
      attributes: {
        importance: {
          name: 'integer({"min":0})',
          control: {
            allowNull: true,
            max: Infinity,
            min: 0,
            primary: false,
            step: 1,
            type: "Number",
          },
          orm: {
            sequelize: {
              allowNull: true,
              autoIncrement: false,
              primaryKey: false,
              type: "INTEGER",
              typeArgs: [],
              validate: { min: 0 },
            },
          },
          serializeORMPropertyValue: expect.any(Function),
          setORMPropertyValue: expect.any(Function),
          setORMQueryFilterValue: expect.any(Function),
        },
      },
    })
  })
})

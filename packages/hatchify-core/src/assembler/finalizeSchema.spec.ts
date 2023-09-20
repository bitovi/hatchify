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
          default: null,
          step: 1,
          type: "Number",
        },
        orm: {
          sequelize: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: false,
            defaultValue: null,
            type: "INTEGER",
            typeArgs: [],
          },
        },
        setClientPropertyValue: expect.any(Function),
        serializeClientPropertyValue: expect.any(Function),
        setClientQueryFilterValue: expect.any(Function),
        serializeClientQueryFilterValue: expect.any(Function),
        setClientPropertyValueFromResponse: expect.any(Function),
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
            default: null,
            step: 1,
            type: "Number",
          },
          orm: {
            sequelize: {
              allowNull: true,
              autoIncrement: false,
              primaryKey: false,
              defaultValue: null,
              type: "INTEGER",
              typeArgs: [],
            },
          },
          setClientPropertyValue: expect.any(Function),
          serializeClientPropertyValue: expect.any(Function),
          setClientQueryFilterValue: expect.any(Function),
          serializeClientQueryFilterValue: expect.any(Function),
          setClientPropertyValueFromResponse: expect.any(Function),
          serializeORMPropertyValue: expect.any(Function),
          setORMPropertyValue: expect.any(Function),
          setORMQueryFilterValue: expect.any(Function),
        },
      },
    })
  })
})

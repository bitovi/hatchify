import { finalizeSchema } from "./finalizeSchema.js"
import { integer, uuid } from "../dataTypes/index.js"
import { UUID_REGEX } from "../dataTypes/uuid/constants.js"
import { uuidv4 } from "../util/uuidv4.js"

describe("finalizeSchema", () => {
  it("finalizes a partial schema", () => {
    expect(
      finalizeSchema({
        name: "Todo",
        id: uuid({ required: true, default: uuidv4 }),
        attributes: {
          importance: integer({ min: 0 }),
        },
      }),
    ).toEqual({
      name: "Todo",
      id: {
        name: 'uuid({"required":true})',
        control: {
          allowNull: false,
          max: 36,
          min: 36,
          primary: false,
          default: expect.any(Function),
          regex: UUID_REGEX,
          type: "String",
          ui: {
            enableCaseSensitiveContains: false,
            displayName: null,
            hidden: false,
          },
        },
        orm: {
          sequelize: {
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: expect.any(Function),
            type: "UUID",
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
      ui: {},
      attributes: {
        importance: {
          name: 'integer({"min":0})',
          control: {
            ui: {
              displayName: null,
              hidden: false,
            },
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
              unique: false,
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

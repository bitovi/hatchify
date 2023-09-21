import { ensureDefaultPrimaryAttribute } from "./ensureDefaultPrimaryAttribute"
import { uuid } from "../dataTypes"
import { UUID_REGEX } from "../dataTypes/uuid/constants"
import { uuidv4 } from "../util/uuidv4"

describe("ensureDefaultPrimaryAttribute", () => {
  it("handles existing primary attribute", () => {
    expect(
      ensureDefaultPrimaryAttribute({
        name: "Todo",
        id: uuid({ required: true, default: uuidv4 }),
        attributes: {},
      }),
    ).toEqual({
      name: "Todo",
      id: {
        name: 'uuid({"required":true})',
        control: {
          type: "String",
          allowNull: false,
          default: expect.any(Function),
          min: 36,
          max: 36,
          primary: true,
          regex: UUID_REGEX,
        },
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: false,
            defaultValue: expect.any(Function),
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
        name: 'uuid({"primary":true,"required":true})',
        control: {
          type: "String",
          allowNull: false,
          default: expect.any(Function),
          min: 36,
          max: 36,
          primary: true,
          regex: UUID_REGEX,
        },
        orm: {
          sequelize: {
            type: "UUID",
            allowNull: false,
            defaultValue: expect.any(Function),
            primaryKey: true,
          },
        },
        finalize: expect.any(Function),
      },
      attributes: {},
    })
  })
})

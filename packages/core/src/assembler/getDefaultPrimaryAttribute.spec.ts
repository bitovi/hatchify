import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute.js"
import { UUID_REGEX } from "../dataTypes/uuid/constants.js"

describe("getDefaultPrimaryAttribute", () => {
  it("creates an integer attribute", () => {
    const attribute = getDefaultPrimaryAttribute()

    expect(attribute).toEqual({
      name: 'uuid({"primary":true,"required":true})',
      control: {
        allowNull: false,
        allowNullInfer: false,
        hidden: null,
        max: 36,
        min: 36,
        default: expect.any(Function),
        primary: true,
        regex: UUID_REGEX,
        type: "String",
      },
      orm: {
        sequelize: {
          allowNull: false,
          defaultValue: expect.any(Function),
          primaryKey: true,
          type: "UUID",
        },
      },
      finalize: expect.any(Function),
    })
  })
})

import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute"
import { UUID_REGEX } from "../dataTypes/uuid/constants"

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

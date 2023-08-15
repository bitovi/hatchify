import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute"

describe("getDefaultPrimaryAttribute", () => {
  it("creates an integer attribute", () => {
    expect(getDefaultPrimaryAttribute()).toEqual({
      name: 'integer({"primary":true,"autoIncrement":true,"required":true,"min":1})',
      control: {
        allowNull: false,
        max: undefined,
        min: 1,
        primary: true,
        step: 1,
        type: "Number",
      },
      orm: {
        sequelize: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: "INTEGER",
          typeArgs: [],
          validate: {
            max: undefined,
            min: 1,
          },
        },
      },
      finalize: expect.any(Function),
    })
  })
})

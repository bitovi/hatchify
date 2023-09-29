import { number } from "./index"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(number()).toEqual({
      name: "number()",
      control: {
        allowNull: undefined,
        max: undefined,
        min: undefined,
        primary: undefined,
        step: undefined,
        type: "Number",
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          autoIncrement: undefined,
          primaryKey: undefined,
          type: "DECIMAL",
          typeArgs: [],
        },
      },
      finalize: expect.any(Function),
    })
  })
})

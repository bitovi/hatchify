import { number } from "./index.js"

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
        ui: {},
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

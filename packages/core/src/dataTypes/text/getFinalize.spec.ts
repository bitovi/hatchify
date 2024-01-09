import { text } from "."

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(text()).toEqual({
      name: "text()",
      control: {
        allowNull: undefined,
        max: Infinity,
        min: 0,
        primary: undefined,
        regex: undefined,
        type: "String",
        ui: {},
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "TEXT",
        },
      },
      finalize: expect.any(Function),
    })
  })
})

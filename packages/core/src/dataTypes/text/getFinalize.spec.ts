import { text } from "."

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(text()).toEqual({
      name: "text()",
      control: {
        allowNull: undefined,
        displayName: undefined,
        max: Infinity,
        min: 0,
        primary: undefined,
        regex: undefined,
        type: "String",
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

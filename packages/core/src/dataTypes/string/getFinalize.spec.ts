import { string } from "./index.js"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(string()).toEqual({
      name: "string()",
      control: {
        allowNull: undefined,
        displayName: undefined,
        max: undefined,
        min: undefined,
        primary: undefined,
        regex: undefined,
        type: "String",
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "STRING",
          typeArgs: [],
        },
      },
      finalize: expect.any(Function),
    })
  })
})

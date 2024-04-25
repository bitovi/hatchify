import { boolean } from "./index.js"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(boolean()).toEqual({
      name: "boolean()",
      control: {
        allowNull: undefined,
        type: "Boolean",
        ui: {},
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          type: "BOOLEAN",
        },
      },
      finalize: expect.any(Function),
    })
  })
})

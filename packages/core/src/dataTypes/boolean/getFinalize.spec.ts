import { boolean } from "./index"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(boolean()).toEqual({
      name: "boolean()",
      control: {
        allowNull: undefined,
        type: "Boolean",
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

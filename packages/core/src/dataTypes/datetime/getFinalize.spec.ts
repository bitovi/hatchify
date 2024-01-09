import { datetime } from "."

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(datetime()).toEqual({
      name: "datetime()",
      control: {
        allowNull: undefined,
        max: undefined,
        min: undefined,
        primary: undefined,
        type: "Datetime",
        ui: {},
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "DATE",
          typeArgs: [],
        },
      },
      finalize: expect.any(Function),
    })
  })
})

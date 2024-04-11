import { dateonly } from "./index.js"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(dateonly()).toEqual({
      name: "dateonly()",
      control: {
        allowNull: undefined,
        max: undefined,
        min: undefined,
        type: "Date",
        primary: undefined,
        ui: {},
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          type: "DATEONLY",
          typeArgs: [],
          primaryKey: undefined,
        },
      },
      finalize: expect.any(Function),
    })
  })
})

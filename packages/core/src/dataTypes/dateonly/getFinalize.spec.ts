import { dateonly } from "./index.js"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(dateonly()).toEqual({
      name: "dateonly()",
      control: {
        allowNull: undefined,
        displayName: undefined,
        max: undefined,
        min: undefined,
        type: "Dateonly",
        primary: undefined,
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

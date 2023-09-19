import { dateonly } from "."

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(dateonly()).toEqual({
      name: "dateonly()",
      control: {
        allowNull: undefined,
        max: undefined,
        min: undefined,
        primary: undefined,
        type: "Dateonly",
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "DATEONLY",
          typeArgs: [],
        },
      },
      finalize: expect.any(Function),
    })
  })
})

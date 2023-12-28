import { dateonly } from "."

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
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          type: "DATEONLY",
          typeArgs: [],
        },
      },
      finalize: expect.any(Function),
    })
  })
})

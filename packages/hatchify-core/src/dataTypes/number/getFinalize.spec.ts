import { integer } from "../integer"

describe("getFinalize", () => {
  it("finalizes a partial attribute", () => {
    expect(integer()).toEqual({
      name: "integer()",
      control: {
        allowNull: undefined,
        max: undefined,
        min: undefined,
        primary: undefined,
        step: 1,
        type: "Number",
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          autoIncrement: undefined,
          primaryKey: undefined,
          type: "INTEGER",
          typeArgs: [],
          validate: { max: undefined, min: undefined },
        },
      },
      finalize: expect.any(Function),
    })
  })
})

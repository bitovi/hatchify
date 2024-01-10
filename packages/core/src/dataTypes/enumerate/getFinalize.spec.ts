import { enumerate } from "./index.js"

describe("getFinalize", () => {
  const values = ["foo", "bar"]

  it("finalizes a partial attribute", () => {
    expect(enumerate({ values })).toEqual({
      name: 'enumerate({"values":["foo","bar"]})',
      control: {
        allowNull: undefined,
        primary: undefined,
        type: "enum",
        values,
      },
      orm: {
        sequelize: {
          allowNull: undefined,
          primaryKey: undefined,
          type: "ENUM",
          typeArgs: values,
        },
      },
      finalize: expect.any(Function),
    })
  })
})

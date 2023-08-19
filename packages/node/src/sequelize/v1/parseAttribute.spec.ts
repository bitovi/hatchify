import { parseAttribute } from "./parseAttribute"
import { DataTypes } from "../../types"

describe("parseAttribute", () => {
  it("parses strings", () => {
    expect(parseAttribute("STRING")).toEqual({ type: DataTypes.STRING })
  })

  it("parses integers", () => {
    expect(parseAttribute("INTEGER")).toEqual({ type: DataTypes.INTEGER })
  })

  it("parses types", () => {
    expect(parseAttribute(DataTypes.STRING)).toEqual({
      type: DataTypes.STRING,
    })
  })

  it("parses objects", () => {
    expect(parseAttribute({ type: "STRING", include: [] })).toEqual({
      type: DataTypes.STRING,
      include: [],
    })

    expect(parseAttribute({ type: DataTypes.STRING, include: [] })).toEqual({
      type: DataTypes.STRING,
      include: [],
    })
  })

  it("parses enum into values validation", async () => {
    const enumAttr = {
      type: "ENUM",
      values: ["foo", "bar", "baz"],
    }
    expect(parseAttribute(enumAttr)).toEqual({
      type: DataTypes.ENUM,
      values: ["foo", "bar", "baz"],
      validate: {
        isIn: [["foo", "bar", "baz"]],
      },
    })
  })
})

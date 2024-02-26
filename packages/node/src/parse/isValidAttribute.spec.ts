import { belongsTo, hasMany, string } from "@hatchifyjs/core"

import { isValidAttribute } from "./isValidAttribute.js"
import { Hatchify } from "../node.js"

describe("isValidAttribute", () => {
  const hatchedNode = new Hatchify({
    Todo: {
      name: "Todo",
      attributes: {
        name: string(),
      },
      relationships: {
        user: belongsTo(),
      },
    },
    User: {
      name: "User",
      attributes: {
        name: string(),
      },
      relationships: {
        todos: hasMany(),
      },
    },
  })

  it("returns true for attribute names", () => {
    expect(isValidAttribute("User", ["name"], hatchedNode.schema)).toBe(true)
    expect(
      isValidAttribute("User", ["todos", "name"], hatchedNode.schema),
    ).toBe(true)
    expect(
      isValidAttribute("User", ["todos", "user", "name"], hatchedNode.schema),
    ).toBe(true)
  })

  it("returns false for non-existing schema names", () => {
    expect(isValidAttribute("Invalid", ["name"], hatchedNode.schema)).toBe(
      false,
    )
  })

  it("returns false for non-existing schema attributes", () => {
    expect(
      isValidAttribute(
        "User",
        ["todos", "user", "invalid"],
        hatchedNode.schema,
      ),
    ).toBe(false)
  })

  it("returns false for relationship names", () => {
    expect(isValidAttribute("User", ["todos"], hatchedNode.schema)).toBe(false)

    expect(
      isValidAttribute("User", ["todos", "user"], hatchedNode.schema),
    ).toBe(false)

    expect(
      isValidAttribute(
        "User",
        ["todos", "user", "invalid"],
        hatchedNode.schema,
      ),
    ).toBe(false)
  })
})

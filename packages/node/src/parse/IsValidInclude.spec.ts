import { belongsTo, hasMany, string } from "@hatchifyjs/core"

import { isValidInclude } from "./IsValidInclude.js"
import { Hatchify } from "../node.js"

describe("isValidInclude", () => {
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

  it("returns true for valid include", () => {
    expect(isValidInclude("User", ["todos"], hatchedNode.schema)).toBe(true)
    expect(isValidInclude("User", ["todos", "user"], hatchedNode.schema)).toBe(
      true,
    )
    expect(
      isValidInclude("User", ["todos", "user", "todos"], hatchedNode.schema),
    ).toBe(true)
  })

  it("returns false for non-existing schema names", () => {
    expect(isValidInclude("Invalid", ["name"], hatchedNode.schema)).toBe(false)
  })

  it("returns false for non-existing include", () => {
    expect(
      isValidInclude("User", ["todos", "user", "invalid"], hatchedNode.schema),
    ).toBe(false)
  })

  it("returns false for attribute names", () => {
    expect(isValidInclude("User", ["name"], hatchedNode.schema)).toBe(false)
    expect(isValidInclude("User", ["todos", "name"], hatchedNode.schema)).toBe(
      false,
    )

    expect(
      isValidInclude("User", ["todos", "user", "name"], hatchedNode.schema),
    ).toBe(false)

    expect(
      isValidInclude("User", ["todos", "user", "invalid"], hatchedNode.schema),
    ).toBe(false)
  })
})

import { isPathIncluded } from "./isPathIncluded.js"

describe("isPathIncluded", () => {
  it("returns true for included path", () => {
    expect(isPathIncluded([], ["name"])).toBe(true)
    expect(isPathIncluded(["todos"], ["name"])).toBe(true)
    expect(isPathIncluded(["todos", "user"], ["name"])).toBe(true)
    expect(isPathIncluded(["todos", "todos.user"], ["name"])).toBe(true)
    expect(isPathIncluded(["todos", "todos.user"], ["todos", "name"])).toBe(
      true,
    )
    expect(
      isPathIncluded(["todos", "todos.user"], ["todos", "user", "name"]),
    ).toBe(true)
  })

  it("returns false for non-included path", () => {
    expect(isPathIncluded(["todos", "todos.user"], ["invalid", "name"])).toBe(
      false,
    )
    expect(
      isPathIncluded(["todos", "todos.user"], ["todos", "invalid", "name"]),
    ).toBe(false)
    expect(isPathIncluded(["todos.user"], ["todos", "name"])).toBe(false)
    expect(isPathIncluded(["todos"], ["todos", "user", "name"])).toBe(false)
  })
})

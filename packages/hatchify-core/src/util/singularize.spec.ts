import { singularize } from "./singularize"

describe("singularize", () => {
  it("removes trailing 's'", () => {
    expect(singularize("users")).toBe("user")
    expect(singularize("persons")).toBe("person")
  })

  it("ignores if there is no trailing 's'", () => {
    expect(singularize("")).toBe("")
    expect(singularize("user")).toBe("user")
    expect(singularize(null as unknown as string)).toBeNull()
    expect(singularize(undefined as unknown as string)).toBeUndefined()
  })
})

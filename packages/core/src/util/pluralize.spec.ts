import { pluralize } from "./pluralize.js"

describe("pluralize", () => {
  it("should pluralize a word with an s", () => {
    expect(pluralize("word")).toBe("words")
    expect(pluralize("words")).toBe("wordss")
    expect(pluralize("twoWord")).toBe("twoWords")
    expect(pluralize(null as unknown as string)).toBeNull()
    expect(pluralize(undefined as unknown as string)).toBeUndefined()
  })
})

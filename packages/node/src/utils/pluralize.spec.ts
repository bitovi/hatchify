import { pluralize } from "./pluralize"

describe("pluralize", () => {
  it("should pluralize a word with an s", () => {
    expect(pluralize("word")).toBe("words")
    expect(pluralize("words")).toBe("wordss")
    expect(pluralize("twoWord")).toBe("twoWords")
  })
})

import { getColumnName } from "./getColumnName"

describe("getColumnName", () => {
  it("gets the correct column word for SQLite", () => {
    expect(getColumnName("word", "sqlite")).toBe("word")
    expect(getColumnName("twoWords", "sqlite")).toBe("two_words")
    expect(getColumnName("itemA.itemB", "sqlite")).toBe("`itemA.item_b`")
  })

  it("gets the correct column word for Postgres", () => {
    expect(getColumnName("word", "postgres")).toBe("word")
    expect(getColumnName("twoWords", "postgres")).toBe("two_words")
    expect(getColumnName("itemA.itemB", "postgres")).toBe(`"itemA.item_b"`)
  })
})

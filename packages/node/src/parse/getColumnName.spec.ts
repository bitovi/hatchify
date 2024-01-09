import { getColumnName } from "./getColumnName.js"

describe("getColumnName", () => {
  it("escapes the column name without dialect", () => {
    expect(getColumnName("word")).toBe("word")
    expect(getColumnName("twoWords")).toBe("two_words")
    expect(getColumnName("itemA.itemB")).toBe("itemA.item_b")
  })

  it("escapes the column name for SQLite", () => {
    expect(getColumnName("word", "sqlite")).toBe("word")
    expect(getColumnName("twoWords", "sqlite")).toBe("two_words")
    expect(getColumnName("itemA.itemB", "sqlite")).toBe("`itemA.item_b`")
  })

  it("escapes the column name for Postgres", () => {
    expect(getColumnName("word", "postgres")).toBe("word")
    expect(getColumnName("twoWords", "postgres")).toBe("two_words")
    expect(getColumnName("itemA.itemB", "postgres")).toBe(`"itemA.item_b"`)
  })
})

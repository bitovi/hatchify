import { getColumnName } from "./getColumnName"

describe("getColumnName", () => {
  it("gets the correct column name", () => {
    expect(getColumnName("name")).toEqual("name")
    expect(getColumnName("somethingElse")).toEqual("something_else")
    expect(getColumnName("itemA.itemB")).toEqual("item_a.item_b")
  })
})

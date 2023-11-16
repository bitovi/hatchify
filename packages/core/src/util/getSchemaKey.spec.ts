import { getSchemaKey } from "./getSchemaKey"

describe("getSchemaKey", () => {
  it("works as expected", () => {
    expect(getSchemaKey({ name: "Two" })).toBe("Two")
    expect(getSchemaKey({ namespace: "One", name: "Two" })).toBe("One_Two")
    expect(getSchemaKey({ name: undefined as unknown as string })).toBe("")
    expect(
      getSchemaKey({
        namespace: "One",
        name: undefined as unknown as string,
      }),
    ).toBe("One_")
  })
})

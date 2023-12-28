import { camelCaseToTitleCase } from "./camelCaseToTitleCase"

describe("camelCaseToTitleCase", () => {
  it("works as expected", () => {
    expect(camelCaseToTitleCase("user")).toBe("User")
    expect(camelCaseToTitleCase("userName")).toBe("User Name")
    expect(camelCaseToTitleCase("parent12LastName")).toBe("Parent 12 Last Name")
    expect(camelCaseToTitleCase("addressLine12345")).toBe("Address Line 12345")
    expect(camelCaseToTitleCase("u")).toBe("U")
    expect(camelCaseToTitleCase("")).toBe("")
    expect(camelCaseToTitleCase(null as unknown as string)).toBeNull()
    expect(camelCaseToTitleCase(undefined as unknown as string)).toBeUndefined()
  })
})

import { camelCaseToTitleCase } from "./camelCaseToTitleCase.js"

describe("camelCaseToTitleCase", () => {
  it("works as expected", () => {
    expect(camelCaseToTitleCase("user")).toBe("User")
    expect(camelCaseToTitleCase("userName")).toBe("User Name")
    expect(camelCaseToTitleCase("parent1LastName")).toBe("Parent 1 Last Name")
    expect(camelCaseToTitleCase("addressLine1")).toBe("Address Line 1")
    expect(camelCaseToTitleCase("zipCode12345")).toBe("Zip Code 12345")
    expect(camelCaseToTitleCase("u")).toBe("U")
    expect(camelCaseToTitleCase("")).toBe("")
    expect(camelCaseToTitleCase(null as unknown as string)).toBeNull()
    expect(camelCaseToTitleCase(undefined as unknown as string)).toBeUndefined()
  })
})

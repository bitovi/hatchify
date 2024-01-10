import { pascalCaseToKebabCase } from "./pascalCaseToKebabCase.js"

describe("pascalCaseToKebabCase", () => {
  it("works as expected", () => {
    expect(pascalCaseToKebabCase("User")).toBe("user")
    expect(pascalCaseToKebabCase("UserName")).toBe("user-name")
    expect(pascalCaseToKebabCase("Parent1LastName")).toBe("parent1-last-name")
    expect(pascalCaseToKebabCase("AddressLine1")).toBe("address-line1")
    expect(pascalCaseToKebabCase("U")).toBe("u")
    expect(pascalCaseToKebabCase("")).toBe("")
    expect(pascalCaseToKebabCase(null as unknown as string)).toBeNull()
    expect(
      pascalCaseToKebabCase(undefined as unknown as string),
    ).toBeUndefined()
  })
})

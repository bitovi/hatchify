import { pascalCaseToCamelCase } from "./pascalCaseToCamelCase.js"

describe("pascalCaseToCamelCase", () => {
  it("works as expected", () => {
    expect(pascalCaseToCamelCase("User")).toBe("user")
    expect(pascalCaseToCamelCase("UserName")).toBe("userName")
    expect(pascalCaseToCamelCase("Parent1LastName")).toBe("parent1LastName")
    expect(pascalCaseToCamelCase("AddressLine1")).toBe("addressLine1")
    expect(pascalCaseToCamelCase("U")).toBe("u")
    expect(pascalCaseToCamelCase("")).toBe("")
    expect(pascalCaseToCamelCase(null as unknown as string)).toBeNull()
    expect(
      pascalCaseToCamelCase(undefined as unknown as string),
    ).toBeUndefined()
  })
})

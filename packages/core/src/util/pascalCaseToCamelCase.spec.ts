import { pascalCaseToCamelCase } from "./pascalCaseToCamelCase"

describe("pascalCaseToCamelCase", () => {
  it("works as expected", () => {
    expect(pascalCaseToCamelCase("User")).toBe("user")
    expect(pascalCaseToCamelCase("UserName")).toBe("userName")
    expect(pascalCaseToCamelCase("Parent1LastName")).toBe("parent1LastName")
    expect(pascalCaseToCamelCase("AddressLine1")).toBe("addressLine1")
    expect(pascalCaseToCamelCase(null as unknown as string)).toBeNull()
    expect(
      pascalCaseToCamelCase(undefined as unknown as string),
    ).toBeUndefined()
  })
})

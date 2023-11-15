import { camelCaseToPascalCase } from "./camelCaseToPascalCase"

describe("camelCaseToPascalCase", () => {
  it("works as expected", () => {
    expect(camelCaseToPascalCase("user")).toBe("User")
    expect(camelCaseToPascalCase("userName")).toBe("UserName")
    expect(camelCaseToPascalCase("parent1LastName")).toBe("Parent1LastName")
    expect(camelCaseToPascalCase("addressLine1")).toBe("AddressLine1")
    expect(camelCaseToPascalCase("u")).toBe("U")
    expect(camelCaseToPascalCase("")).toBe("")
    expect(camelCaseToPascalCase(null as unknown as string)).toBeNull()
    expect(
      camelCaseToPascalCase(undefined as unknown as string),
    ).toBeUndefined()
  })
})

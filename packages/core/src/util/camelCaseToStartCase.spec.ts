import { camelCaseToStartCase } from "./camelCaseToStartCase"

describe("camelCaseToStartCase", () => {
  it("works as expected", () => {
    expect(camelCaseToStartCase("user")).toBe("User")
    expect(camelCaseToStartCase("userName")).toBe("User Name")
    expect(camelCaseToStartCase("parent1LastName")).toBe("Parent 1 Last Name")
    expect(camelCaseToStartCase("addressLine1")).toBe("Address Line 1")
    expect(camelCaseToStartCase("u")).toBe("U")
    expect(camelCaseToStartCase("")).toBe("")
    expect(camelCaseToStartCase(null as unknown as string)).toBeNull()
    expect(camelCaseToStartCase(undefined as unknown as string)).toBeUndefined()
  })
})

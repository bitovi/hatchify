import { getSequelizeSchemaName } from "./getSequelizeSchemaName"

describe("getSequelizeSchemaName", () => {
  it("is always undefined for sqlite", () => {
    expect(getSequelizeSchemaName("sqlite", "schema")).toBeUndefined()
    expect(getSequelizeSchemaName("sqlite", "")).toBeUndefined()
    expect(getSequelizeSchemaName("sqlite", undefined)).toBeUndefined()
    expect(
      getSequelizeSchemaName("sqlite", null as unknown as string),
    ).toBeUndefined()
  })

  it("is always defined for postgres", () => {
    expect(getSequelizeSchemaName("postgres", "schema")).toBe("schema")
    expect(getSequelizeSchemaName("postgres", "")).toBe("public")
    expect(getSequelizeSchemaName("postgres", undefined)).toBe("public")
    expect(getSequelizeSchemaName("postgres", null as unknown as string)).toBe(
      "public",
    )
  })
})

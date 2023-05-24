import { Scaffold } from "./index"
import { ScaffoldSymbolModel, DataTypes, ScaffoldModel } from "./types"

describe("Internal Tests", () => {
  const Model: ScaffoldModel = {
    name: "Model",
    attributes: {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  }

  it("should test url is valid scaffold shape", async () => {
    const scaffold = new Scaffold([Model], { prefix: "/api" })

    // Test expected good paths
    expect(scaffold.isValidScaffoldRoute("GET", "/api/models/1")).toBe(true)
    expect(
      scaffold.isValidScaffoldRoute("GET", "/api/models/1?params=true"),
    ).toBe(true)
    expect(scaffold.isValidScaffoldRoute("GET", "/api/models")).toBe(true)

    // Test expected bad paths
    expect(scaffold.isValidScaffoldRoute("GET", "/api/Model/1")).toBe(false)
    expect(scaffold.isValidScaffoldRoute("GET", "/api/Models/1")).toBe(false)
    expect(scaffold.isValidScaffoldRoute("GET", "/api/model/1")).toBe(false)
    expect(scaffold.isValidScaffoldRoute("GET", "/api/Unknown")).toBe(false)
    expect(scaffold.isValidScaffoldRoute("GET", "/api/Unknown/1")).toBe(false)

    await scaffold.orm.close()
  })

  it("should test case difference for model name in url", async () => {
    const scaffold = new Scaffold([Model], { prefix: "/api" })

    // Test some with all lowercase
    expect(scaffold.getScaffoldModelNameForRoute("/api/models")).toBe("Model")
    expect(scaffold.getScaffoldModelNameForRoute("/api/models/1")).toBe("Model")
    expect(
      scaffold.getScaffoldModelNameForRoute("/api/models/1?params=true"),
    ).toBe("Model")
    expect(scaffold.getScaffoldModelNameForRoute("/api/models")).toBe("Model")

    // Test some in all caps
    expect(scaffold.getScaffoldModelNameForRoute("/api/MODEL")).toBe(false)
    expect(scaffold.getScaffoldModelNameForRoute("/api/MODELS/1")).toBe(false)
    expect(
      scaffold.getScaffoldModelNameForRoute("/api/MODELS/1?params=true"),
    ).toBe(false)
    expect(scaffold.getScaffoldModelNameForRoute("/api/MODELS")).toBe(false)

    await scaffold.orm.close()
  })

  it("should test return false for unknown model names in url", async () => {
    const scaffold = new Scaffold([Model], { prefix: "/api" })

    // Test expected bad paths
    expect(scaffold.getScaffoldModelNameForRoute("/api/Unknown")).toBe(false)
    expect(scaffold.getScaffoldModelNameForRoute("/api/Unknown/1")).toBe(false)

    await scaffold.orm.close()
  })

  it("should test the existance of scaffold symbol on models", async () => {
    const scaffold = new Scaffold([Model], { prefix: "/api" })

    const model2 = scaffold.model.Model[ScaffoldSymbolModel]
    expect(model2).toBeTruthy()
    expect(model2).toHaveProperty("attributes")
    expect(model2).toHaveProperty("name")

    await scaffold.orm.close()
  })
})

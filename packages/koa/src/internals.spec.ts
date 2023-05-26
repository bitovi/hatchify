import { Hatchify } from "./koa"
import type { HatchifyModel } from "./types"
import { HatchifySymbolModel, DataTypes } from "./types"

describe("Internal Tests", () => {
  const Model: HatchifyModel = {
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

  it("should test url is valid hatchify shape", async () => {
    const hatchify = new Hatchify([Model], { prefix: "/api" })

    // Test expected good paths
    expect(hatchify.isValidHatchifyRoute("GET", "/api/models/1")).toBe(true)
    expect(
      hatchify.isValidHatchifyRoute("GET", "/api/models/1?params=true"),
    ).toBe(true)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/models")).toBe(true)

    // Test expected bad paths
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Model/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Models/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/model/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Unknown")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Unknown/1")).toBe(false)

    await hatchify.orm.close()
  })

  it("should test case difference for model name in url", async () => {
    const hatchify = new Hatchify([Model], { prefix: "/api" })

    // Test some with all lowercase
    expect(hatchify.getHatchifyModelNameForRoute("/api/models")).toBe("Model")
    expect(hatchify.getHatchifyModelNameForRoute("/api/models/1")).toBe("Model")
    expect(
      hatchify.getHatchifyModelNameForRoute("/api/models/1?params=true"),
    ).toBe("Model")
    expect(hatchify.getHatchifyModelNameForRoute("/api/models")).toBe("Model")

    // Test some in all caps
    expect(hatchify.getHatchifyModelNameForRoute("/api/MODEL")).toBe(false)
    expect(hatchify.getHatchifyModelNameForRoute("/api/MODELS/1")).toBe(false)
    expect(
      hatchify.getHatchifyModelNameForRoute("/api/MODELS/1?params=true"),
    ).toBe(false)
    expect(hatchify.getHatchifyModelNameForRoute("/api/MODELS")).toBe(false)

    await hatchify.orm.close()
  })

  it("should test return false for unknown model names in url", async () => {
    const hatchify = new Hatchify([Model], { prefix: "/api" })

    // Test expected bad paths
    expect(hatchify.getHatchifyModelNameForRoute("/api/Unknown")).toBe(false)
    expect(hatchify.getHatchifyModelNameForRoute("/api/Unknown/1")).toBe(false)

    await hatchify.orm.close()
  })

  it("should test the existance of hatchify symbol on models", async () => {
    const hatchify = new Hatchify([Model], { prefix: "/api" })

    const model2 = hatchify.model.Model[HatchifySymbolModel]
    expect(model2).toBeTruthy()
    expect(model2).toHaveProperty("attributes")
    expect(model2).toHaveProperty("name")

    await hatchify.orm.close()
  })
})

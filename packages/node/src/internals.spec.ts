import "sqlite3"
import { Hatchify } from "./node"
import type { HatchifyModel } from "./types"
import { DataTypes, HatchifySymbolModel } from "./types"

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

  let hatchify
  afterEach(async () => {
    await hatchify.orm.close()
  })

  it("should test url is valid hatchify shape", async () => {
    hatchify = new Hatchify([Model], { prefix: "/api" })

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
  })

  it("should test case difference for model name in url", async () => {
    hatchify = new Hatchify([Model], { prefix: "/api" })

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
  })

  it("only has one valid endpoint name per model name", async () => {
    hatchify = new Hatchify(
      [
        {
          ...Model,
          name: "Person",
        },
      ],
      { prefix: "/api" },
    )

    // Test actual vs false pluralization
    expect(hatchify.getHatchifyModelNameForRoute("/api/people")).toBe("Person")
    expect(hatchify.getHatchifyModelNameForRoute("/api/persons")).toBe(false)

    expect(hatchify.getHatchifyModelNameForRoute("/api/people/1")).toBe(
      "Person",
    )
    expect(hatchify.getHatchifyModelNameForRoute("/api/persons/1")).toBe(false)
  })

  it("should test return false for unknown model names in url", async () => {
    hatchify = new Hatchify([Model], { prefix: "/api" })

    // Test expected bad paths
    expect(hatchify.getHatchifyModelNameForRoute("/api/Unknown")).toBe(false)
    expect(hatchify.getHatchifyModelNameForRoute("/api/Unknown/1")).toBe(false)
  })

  it("should test the existance of hatchify symbol on models", async () => {
    hatchify = new Hatchify([Model], { prefix: "/api" })

    const model2 = hatchify.model.Model[HatchifySymbolModel]
    expect(model2).toBeTruthy()
    expect(model2).toHaveProperty("attributes")
    expect(model2).toHaveProperty("name")
  })
})

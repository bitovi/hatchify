import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { jest } from "@jest/globals"

import { Hatchify } from "./node.js"
import { HatchifySymbolModel } from "./types.js"

describe("Internal Tests", () => {
  const Model = {
    name: "Model",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  } satisfies PartialSchema

  let hatchify: Hatchify

  afterEach(async () => {
    await hatchify.orm.close()
  })

  it("should test url is valid hatchify shape", async () => {
    hatchify = new Hatchify({ Model }, { prefix: "/api" })

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
    expect(hatchify.isValidHatchifyRoute("GET", "/api/unknown")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/unknown/1")).toBe(false)
  })

  it("should test the existence of hatchify symbol on models", async () => {
    hatchify = new Hatchify({ Model }, { prefix: "/api" })

    const model2 = hatchify.model.Model[HatchifySymbolModel]
    expect(model2).toBeTruthy()
    expect(model2).toHaveProperty("attributes")
    expect(model2).toHaveProperty("name")
  })

  it("should print all endpoints", async () => {
    const consoleLogSpy = jest.spyOn(global.console, "info")

    hatchify = new Hatchify({ Model }, { prefix: "/api" })

    hatchify.printEndpoints()
    expect(consoleLogSpy).toBeCalledWith(
      "Hatchify endpoints:\r\n\r\nGET    /api/models\r\nPOST   /api/models\r\nGET    /api/models/:id\r\nPATCH  /api/models/:id\r\nDELETE /api/models/:id",
    )
  })
})

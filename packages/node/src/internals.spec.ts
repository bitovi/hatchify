import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { jest } from "@jest/globals"

import { Hatchify } from "./node.js"

describe("Internal Tests", () => {
  const Schema = {
    name: "Schema",
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
    hatchify = new Hatchify({ Schema }, { prefix: "/api" })

    // Test expected good paths
    expect(hatchify.isValidHatchifyRoute("GET", "/api/schemas/1")).toBe(true)
    expect(
      hatchify.isValidHatchifyRoute("GET", "/api/schemas/1?params=true"),
    ).toBe(true)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/schemas")).toBe(true)

    // Test expected bad paths
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Schema/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/Models/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/model/1")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/unknown")).toBe(false)
    expect(hatchify.isValidHatchifyRoute("GET", "/api/unknown/1")).toBe(false)
  })

  it("should print all endpoints", async () => {
    const consoleLogSpy = jest.spyOn(global.console, "info")

    hatchify = new Hatchify({ Schema }, { prefix: "/api" })

    hatchify.printEndpoints()
    expect(consoleLogSpy).toBeCalledWith(
      "Hatchify endpoints:\r\n\r\nGET    /api/schemas\r\nPOST   /api/schemas\r\nGET    /api/schemas/:id\r\nPATCH  /api/schemas/:id\r\nDELETE /api/schemas/:id",
    )
  })
})

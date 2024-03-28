import type { HatchifyErrorOptions } from "@hatchifyjs/node"
import { HatchifyError } from "@hatchifyjs/node"
import { jest } from "@jest/globals"
import type { Request, Response } from "express"

import { errorHandlerMiddleware } from "./middleware.js"

describe("errorHandlerMiddleware", () => {
  it("handles an Error", async () => {
    const json = jest.fn()
    const status = jest.fn(() => {
      return { json } as unknown as Response
    })

    const res: Partial<Response> = { status }

    const err = Error()
    await errorHandlerMiddleware({} as Request, res as Response, () => {
      throw err
    })

    expect(status).toHaveBeenCalledTimes(1)
    expect(status).toHaveBeenLastCalledWith(500)

    expect(json).toHaveBeenCalledTimes(1)
    expect(json).toHaveBeenLastCalledWith({
      errors: [err],
      jsonapi: { version: "1.0" },
    })
  })

  it("handles a HatchifyError", async () => {
    const json = jest.fn()
    const status = jest.fn(() => {
      return { json } as unknown as Response
    })

    const res: Partial<Response> = { status }

    const err = new HatchifyError(createErrorOptions(500))
    await errorHandlerMiddleware({} as Request, res as Response, () => {
      throw err
    })

    expect(status).toHaveBeenCalledTimes(1)
    expect(status).toHaveBeenLastCalledWith(500)

    expect(json).toHaveBeenCalledTimes(1)
    expect(json).toHaveBeenLastCalledWith({
      errors: [new HatchifyError(createErrorOptions(500))],
      jsonapi: { version: "1.0" },
    })
  })

  it("handles an array of HatchifyErrors", async () => {
    const json = jest.fn()
    const status = jest.fn(() => {
      return { json } as unknown as Response
    })

    const res: Partial<Response> = { status }

    const err1 = new HatchifyError(createErrorOptions(501, "1"))
    const err2 = new HatchifyError(createErrorOptions(502, "2"))
    await errorHandlerMiddleware({} as Request, res as Response, () => {
      throw [err1, err2]
    })

    expect(status).toHaveBeenCalledTimes(1)
    expect(status).toHaveBeenLastCalledWith(501)

    expect(json).toHaveBeenCalledTimes(1)
    expect(json).toHaveBeenLastCalledWith({
      errors: [
        new HatchifyError(createErrorOptions(501, "1")),
        new HatchifyError(createErrorOptions(502, "2")),
      ],
      jsonapi: { version: "1.0" },
    })
  })
})

function createErrorOptions(status: number, suffix = ""): HatchifyErrorOptions {
  return {
    code: `CODE${suffix}`,
    detail: `DETAIL1${suffix}`,
    source: { parameter: `PARAMETER1${suffix}`, pointer: `/POINTER1${suffix}` },
    status,
    title: `TITLE1${suffix}`,
  }
}

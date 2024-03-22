import { jest } from "@jest/globals"

import {
  createMiddleware,
  destroyMiddleware,
  findAllMiddleware,
  findAndCountAllMiddleware,
  findOneMiddleware,
  getMiddlewareFunctions,
  resolveWildcard,
  updateMiddleware,
} from "./middleware.js"
import type { Hatchify } from "./node.js"
import type { NextFunction } from "./types.js"

describe("middleware", () => {
  let hatchedNode: Hatchify
  const baseRequest = {
    body: {},
    errorCallback: jest.fn(),
    path: "/api/schemas",
    querystring: "",
  }

  beforeEach(() => {
    hatchedNode = {
      everything: {
        Schema: {
          findAll: jest.fn(),
          findOne: jest.fn(),
          findAndCountAll: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          destroy: jest.fn(),
        },
      },
      orm: {
        models: {
          Schema: {},
        },
      },
    } as unknown as Hatchify
  })

  describe("getMiddlewareFunctions", () => {
    it("exports all middleware", () => {
      expect(getMiddlewareFunctions(hatchedNode, "Schema")).toEqual({
        findAll: expect.any(Function),
        findOne: expect.any(Function),
        findAndCountAll: expect.any(Function),
        create: expect.any(Function),
        destroy: expect.any(Function),
        update: expect.any(Function),
        all: expect.any(Function),
      })
    })
  })

  describe("findAllMiddleware", () => {
    it("does not skip GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Schema")

      await findAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Schema")

      await findAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.findAll).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "*")

      await findAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Invalid")

      await findAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.findAll).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("findOneMiddleware", () => {
    it("does not skip GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Schema")

      await findOneImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findOne).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Schema")

      await findOneImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.findOne).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "*")

      await findOneImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findOne).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Invalid")

      await findOneImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.findOne).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("findAndCountAllMiddleware", () => {
    it("does not skip GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Schema",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findAndCountAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Schema",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(
        hatchedNode.everything.Schema.findAndCountAll,
      ).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(hatchedNode, "*")

      await findAndCountAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.findAndCountAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Invalid",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(
        hatchedNode.everything.Schema.findAndCountAll,
      ).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("createMiddleware", () => {
    it("does not skip POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Schema")

      await createImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.create).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Schema")

      await createImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.create).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "*")

      await createImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Schema.create).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Invalid")

      await createImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.create).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("updateMiddleware", () => {
    it("does not skip PATCH calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Schema")

      await updateImpl({ ...baseRequest, method: "PATCH" }, next)

      expect(hatchedNode.everything.Schema.update).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Schema")

      await updateImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.update).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "*")

      await updateImpl({ ...baseRequest, method: "PATCH" }, next)

      expect(hatchedNode.everything.Schema.update).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Invalid")

      await updateImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.update).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("destroyMiddleware", () => {
    it("does not skip DELETE calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Schema")

      await destroyImpl({ ...baseRequest, method: "DELETE" }, next)

      expect(hatchedNode.everything.Schema.destroy).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Schema")

      await destroyImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.destroy).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "*")

      await destroyImpl({ ...baseRequest, method: "DELETE" }, next)

      expect(hatchedNode.everything.Schema.destroy).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        schemaName: "Schema",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Invalid")

      await destroyImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Schema.destroy).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("resolveWildcard", () => {
    it("resolves properly", () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        schemaName: "Schema",
      })
      expect(resolveWildcard(hatchedNode, "/models")).toBe("Schema")
    })
  })
})

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
    path: "/api/models",
    querystring: "",
  }

  beforeEach(() => {
    hatchedNode = {
      everything: {
        Model: {
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
          Model: {},
        },
      },
    } as unknown as Hatchify
  })

  describe("getMiddlewareFunctions", () => {
    it("exports all middleware", () => {
      expect(getMiddlewareFunctions(hatchedNode, "Model")).toEqual({
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
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Model")

      await findAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Model")

      await findAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.findAll).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "*")

      await findAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAllImpl = findAllMiddleware(hatchedNode, "Invalid")

      await findAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.findAll).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("findOneMiddleware", () => {
    it("does not skip GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Model")

      await findOneImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findOne).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Model")

      await findOneImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.findOne).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "*")

      await findOneImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findOne).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findOneImpl = findOneMiddleware(hatchedNode, "Invalid")

      await findOneImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.findOne).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("findAndCountAllMiddleware", () => {
    it("does not skip GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Model",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findAndCountAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Model",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(
        hatchedNode.everything.Model.findAndCountAll,
      ).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(hatchedNode, "*")

      await findAndCountAllImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.findAndCountAll).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const findAndCountAllImpl = findAndCountAllMiddleware(
        hatchedNode,
        "Invalid",
      )

      await findAndCountAllImpl({ ...baseRequest, method: "POST" }, next)

      expect(
        hatchedNode.everything.Model.findAndCountAll,
      ).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("createMiddleware", () => {
    it("does not skip POST calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Model")

      await createImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.create).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Model")

      await createImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.create).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "*")

      await createImpl({ ...baseRequest, method: "POST" }, next)

      expect(hatchedNode.everything.Model.create).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const createImpl = createMiddleware(hatchedNode, "Invalid")

      await createImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.create).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("updateMiddleware", () => {
    it("does not skip PATCH calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Model")

      await updateImpl({ ...baseRequest, method: "PATCH" }, next)

      expect(hatchedNode.everything.Model.update).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Model")

      await updateImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.update).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "*")

      await updateImpl({ ...baseRequest, method: "PATCH" }, next)

      expect(hatchedNode.everything.Model.update).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const updateImpl = updateMiddleware(hatchedNode, "Invalid")

      await updateImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.update).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("destroyMiddleware", () => {
    it("does not skip DELETE calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Model")

      await destroyImpl({ ...baseRequest, method: "DELETE" }, next)

      expect(hatchedNode.everything.Model.destroy).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("skips GET calls", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Model")

      await destroyImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.destroy).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })

    it("handles wildcard", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "*")

      await destroyImpl({ ...baseRequest, method: "DELETE" }, next)

      expect(hatchedNode.everything.Model.destroy).toHaveBeenCalled()
      expect(next).not.toHaveBeenCalled()
    })

    it("handles non-existing models", async () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        id: "5354dff7-381c-43bf-866f-2b889919f632",
        modelName: "Model",
      })
      const next = jest.fn() as NextFunction
      const destroyImpl = destroyMiddleware(hatchedNode, "Invalid")

      await destroyImpl({ ...baseRequest, method: "GET" }, next)

      expect(hatchedNode.everything.Model.destroy).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe("resolveWildcard", () => {
    it("resolves properly", () => {
      hatchedNode.getHatchifyURLParamsForRoute = () => ({
        modelName: "Model",
      })
      expect(resolveWildcard(hatchedNode, "/models")).toBe("Model")
    })
  })
})

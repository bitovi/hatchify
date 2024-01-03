import { integer } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

import { Hatchify } from "./node.js"
import * as Sequelize from "./sequelize/index.js"
import { HatchifySymbolModel } from "./types.js"
import type { SequelizeWithHatchify } from "./types.js"

jest.mock("./sequelize", () => ({
  ...jest.requireActual("./sequelize"),
  createSequelizeInstance: jest.fn(),
}))

describe("node", () => {
  const TestSchema_User: PartialSchema = {
    name: "User",
    namespace: "TestSchema",
    attributes: {
      age: integer({ min: 0 }),
    },
  }

  describe("modelSync", () => {
    let createSequelizeInstanceMock: jest.SpyInstance

    describe("sqlite", () => {
      const sequelizeInstanceMock = {
        connectionManager: {},
        createSchema: jest.fn(),
        define: jest.fn(),
        dropAllSchemas: jest.fn(),
        getDialect: () => "sqlite",
        models: {
          TestSchema_User: { [HatchifySymbolModel]: null },
        },
        showAllSchemas: jest.fn().mockResolvedValue(["initial_schema"]),
        sync: jest.fn(),
      } as unknown as SequelizeWithHatchify

      beforeEach(() => {
        createSequelizeInstanceMock = jest
          .spyOn(Sequelize, "createSequelizeInstance")
          .mockReturnValue(sequelizeInstanceMock)
      })

      afterEach(() => {
        createSequelizeInstanceMock.mockRestore()
      })

      it("handles no arguments", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync()

        expect(sequelizeInstanceMock.dropAllSchemas).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith(undefined)
      })

      it("handles alter", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync({ alter: true })

        expect(sequelizeInstanceMock.dropAllSchemas).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith({ alter: true })
      })

      it("handles force", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync({ force: true })

        expect(sequelizeInstanceMock.dropAllSchemas).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith({ force: true })
      })
    })

    describe("postgres", () => {
      const sequelizeInstanceMock = {
        connectionManager: {},
        createSchema: jest.fn(),
        define: jest.fn(),
        dropAllSchemas: jest.fn(),
        getDialect: () => "postgres",
        models: {
          TestSchema_User: { [HatchifySymbolModel]: null },
        },
        showAllSchemas: jest.fn().mockResolvedValue(["initial_schema"]),
        sync: jest.fn(),
      } as unknown as SequelizeWithHatchify

      beforeEach(() => {
        createSequelizeInstanceMock = jest
          .spyOn(Sequelize, "createSequelizeInstance")
          .mockReturnValue(sequelizeInstanceMock)
      })

      afterEach(() => {
        createSequelizeInstanceMock.mockRestore()
      })

      it("handles no arguments", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync()

        expect(sequelizeInstanceMock.dropAllSchemas).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith(undefined)
      })

      it("handles alter", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync({ alter: true })

        expect(sequelizeInstanceMock.dropAllSchemas).not.toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).toHaveBeenCalledWith(
          "test_schema",
          {},
        )
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith({ alter: true })
      })

      it("handles force", async () => {
        const hatchedNode = new Hatchify({ TestSchema_User })
        await hatchedNode.modelSync({ force: true })

        expect(sequelizeInstanceMock.dropAllSchemas).toHaveBeenCalled()
        expect(sequelizeInstanceMock.createSchema).toHaveBeenCalledWith(
          "test_schema",
          {},
        )
        expect(sequelizeInstanceMock.sync).toHaveBeenCalledWith({ force: true })
      })
    })
  })
})

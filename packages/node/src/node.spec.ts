import { integer } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"
import { jest } from "@jest/globals"

import * as actualSequelize from "./sequelize/index.js"
import { HatchifySymbolModel } from "./types.js"

const initSQLLiteSequelizeInstanceMock = () => ({
  connectionManager: {},
  createSchema: jest.fn(),
  define: jest.fn(),
  dropAllSchemas: jest.fn(),
  getDialect: () => "sqlite",
  models: {
    TestSchema_User: { [HatchifySymbolModel]: null },
  },
  showAllSchemas: jest
    .fn<() => Promise<string[]>>()
    .mockResolvedValue(["initial_schema"]),
  sync: jest.fn(),
})
let sequelizeInstanceMock = initSQLLiteSequelizeInstanceMock()
const createSequelizeInstanceMock = jest.fn(() => sequelizeInstanceMock)

jest.unstable_mockModule("./sequelize/index.js", async () => ({
  ...actualSequelize,
  createSequelizeInstance: createSequelizeInstanceMock,
}))

// this import needs to be dynamic and needs to happen after the mocking when using Jest + ESM
const { Hatchify } = await import("./node.js")

describe("node", () => {
  const TestSchema_User: PartialSchema = {
    name: "User",
    namespace: "TestSchema",
    attributes: {
      age: integer({ min: 0 }),
    },
  }

  describe("modelSync", () => {
    describe("sqlite", () => {
      afterEach(() => {
        sequelizeInstanceMock = initSQLLiteSequelizeInstanceMock()
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
      const initPostgresSequelizeInstanceMock = () => ({
        connectionManager: {},
        createSchema: jest.fn(),
        define: jest.fn(),
        dropAllSchemas: jest.fn(),
        getDialect: () => "postgres",
        models: {
          TestSchema_User: { [HatchifySymbolModel]: null },
        },
        showAllSchemas: jest
          .fn<() => Promise<string[]>>()
          .mockResolvedValue(["initial_schema"]),
        sync: jest.fn(),
      })

      beforeEach(() => {
        sequelizeInstanceMock = initPostgresSequelizeInstanceMock()
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

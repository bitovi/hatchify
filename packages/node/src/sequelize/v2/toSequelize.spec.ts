import { assembler, integer, uuid, uuidv4 } from "@hatchifyjs/hatchify-core"
import { Sequelize } from "sequelize"
import type { ModelStatic } from "sequelize"

import { toSequelize } from "./toSequelize"

describe("toSequelize", () => {
  const sequelize = new Sequelize("sqlite::memory:")
  let schemas: {
    [schemaName: string]: ModelStatic<any>
  }

  beforeAll(async () => {
    schemas = toSequelize(
      assembler({
        Todo: {
          name: "Todo",
          id: uuid({ required: true, default: uuidv4 }),
          attributes: {
            importance: integer({ min: 0, max: 1 }),
          },
        },
      }),
      sequelize,
    )

    await sequelize.sync()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  describe("validate", () => {
    describe("build", () => {
      it("lets a valid value go through", () => {
        expect(
          schemas.Todo.build({
            importance: 1,
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: 1 },
        })
      })

      it("does not enforce minimum value", () => {
        expect(
          schemas.Todo.build({
            importance: -1,
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: -1 },
        })
      })

      it("does not enforce maximum value", () => {
        expect(
          schemas.Todo.build({
            importance: 2,
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: 2 },
        })
      })

      it("does not enforce type check", () => {
        expect(
          schemas.Todo.build({
            importance: "not a number",
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: "not a number" },
        })
      })

      it("does not enforce step check", () => {
        expect(
          schemas.Todo.build({
            importance: 0.1,
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: 0.1 },
        })
      })

      it("does not enforce values for optional attributes", () => {
        expect(schemas.Todo.build({})).toMatchObject({
          dataValues: { id: expect.any(String) },
        })
      })
    })

    describe("save", () => {
      it("lets a valid value go through", async () => {
        expect(
          await schemas.Todo.build({
            importance: 1,
          }).save(),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: 1 },
        })
      })

      it("enforces minimum value", async () => {
        await expect(
          schemas.Todo.build({
            importance: -1,
          }).save(),
        ).rejects.toThrow("greater than or equal to 0")
      })

      it("enforces maximum value", async () => {
        await expect(
          schemas.Todo.build({
            importance: 2,
          }).save(),
        ).rejects.toThrow("less than or equal to 1")
      })

      it("enforces type checks", async () => {
        await expect(
          schemas.Todo.build({
            importance: "not a number",
          }).save(),
        ).rejects.toThrow("as a number")
      })

      it("enforces step check", async () => {
        await expect(
          schemas.Todo.build({
            importance: 0.1,
          }).save(),
        ).rejects.toThrow("as multiples of 1")
      })

      it("does not require values for optional attributes", async () => {
        expect(await schemas.Todo.build({}).save()).toMatchObject({
          dataValues: { id: expect.any(String) },
        })
      })
    })

    describe("create", () => {
      it("lets a valid value go through", async () => {
        expect(
          await schemas.Todo.create({
            importance: 1,
          }),
        ).toMatchObject({
          dataValues: { id: expect.any(String), importance: 1 },
        })
      })

      it("enforces minimum value", async () => {
        await expect(
          schemas.Todo.create({
            importance: -1,
          }),
        ).rejects.toThrow("greater than or equal to 0")
      })

      it("enforces maximum value", async () => {
        await expect(
          schemas.Todo.create({
            importance: 2,
          }),
        ).rejects.toThrow("less than or equal to 1")
      })

      it("enforces type checks", async () => {
        await expect(
          schemas.Todo.create({
            importance: "not a number",
          }),
        ).rejects.toThrow("as a number")
      })

      it("enforces step check", async () => {
        await expect(
          schemas.Todo.create({
            importance: 0.1,
          }),
        ).rejects.toThrow("as multiples of 1")
      })

      it("does not require values for optional attributes", async () => {
        expect(await schemas.Todo.create({})).toMatchObject({
          dataValues: { id: expect.any(String) },
        })
      })
    })
  })
})

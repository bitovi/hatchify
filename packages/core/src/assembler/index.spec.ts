import type { PartialSchema } from "./types"
import { integer, uuid } from "../dataTypes"
import { HatchifyInvalidSchemaError } from "../types"
import { uuidv4 } from "../util/uuidv4"

import { assembler } from "."

describe("assembler", () => {
  describe("assembler", () => {
    const Todo: PartialSchema = {
      name: "Todo",
      id: uuid({ required: true, default: uuidv4 }),
      attributes: {
        importance: integer({ min: 0 }),
      },
    }

    describe("key", () => {
      it("enforces key to equal ${name}", () => {
        expect(() =>
          assembler({
            Invalid: {
              name: "Todo",
              attributes: {},
            },
          }),
        ).toThrow(
          new HatchifyInvalidSchemaError("Schema key needs to equal Todo"),
        )
      })

      it("enforces key to equal ${namespace}_${name}", () => {
        expect(() =>
          assembler({
            Invalid: {
              name: "Todo",
              namespace: "Admin",
              attributes: {},
            },
          }),
        ).toThrow(
          new HatchifyInvalidSchemaError(
            "Schema key needs to equal Admin_Todo",
          ),
        )
      })
    })

    describe("id", () => {
      it("injects primary key", () => {
        expect(Todo.id?.control.primary).toBeUndefined()
        expect(Todo.id?.orm.sequelize.primaryKey).toBeUndefined()

        const { Todo: assembledTodo } = assembler({ Todo })

        expect(assembledTodo.id.control.primary).toBe(true)
        expect(assembledTodo.id.orm.sequelize.primaryKey).toBe(true)
      })

      it("finalizes correctly", () => {
        expect(Todo.id?.control.allowNull).toBe(false)
        expect(Todo.id?.control.min).toBe(36)
        expect(Todo.id?.control.max).toBe(36)
        expect(Todo.id?.control.primary).toBeUndefined()

        expect(Todo.id?.orm.sequelize.allowNull).toBe(false)
        expect(Todo.id?.orm.sequelize.defaultValue).toEqual(
          expect.any(Function),
        )
        expect(Todo.id?.orm.sequelize.primaryKey).toBeUndefined()

        const { Todo: assembledTodo } = assembler({ Todo })

        expect(assembledTodo.id.control.allowNull).toBe(false)
        expect(assembledTodo.id.control.min).toBe(36)
        expect(assembledTodo.id.control.max).toBe(36)
        expect(assembledTodo.id.control.primary).toBe(true)

        expect(assembledTodo.id.orm.sequelize.allowNull).toBe(false)
        expect(assembledTodo.id.orm.sequelize.defaultValue).toEqual(
          expect.any(Function),
        )
        expect(assembledTodo.id.orm.sequelize.primaryKey).toBe(true)
      })

      it("creates id if you did not create one", () => {
        const User: PartialSchema = {
          name: "User",
          attributes: {},
        }

        const { User: assembledUser } = assembler({ User })

        expect(assembledUser.id.control.allowNull).toBe(false)
        expect(assembledUser.id.control.min).toBe(36)
        expect(assembledUser.id.control.max).toBe(36)
        expect(assembledUser.id.control.primary).toBe(true)

        expect(assembledUser.id.orm.sequelize.allowNull).toBe(false)
        expect(assembledUser.id.orm.sequelize.defaultValue).toEqual(
          expect.any(Function),
        )
        expect(assembledUser.id.orm.sequelize.primaryKey).toBe(true)
      })
    })

    describe("attributes", () => {
      it("finalizes correctly", () => {
        expect(Todo.attributes.importance.control.allowNull).toBeUndefined()
        expect(
          "min" in Todo.attributes.importance.control &&
            Todo.attributes.importance.control.min,
        ).toBe(0)
        expect(
          "max" in Todo.attributes.importance.control &&
            Todo.attributes.importance.control.max,
        ).toBeUndefined()
        expect(
          "primary" in Todo.attributes.importance.control &&
            Todo.attributes.importance.control.primary,
        ).toBeUndefined()

        expect(
          Todo.attributes.importance.orm.sequelize.allowNull,
        ).toBeUndefined()
        expect(
          "autoIncrement" in Todo.attributes.importance.orm.sequelize &&
            Todo.attributes.importance.orm.sequelize.autoIncrement,
        ).toBeUndefined()
        expect(
          "primaryKey" in Todo.attributes.importance.orm.sequelize &&
            Todo.attributes.importance.orm.sequelize.primaryKey,
        ).toBeUndefined()

        const { Todo: assembledTodo } = assembler({ Todo })

        expect(assembledTodo.attributes.importance.control.allowNull).toBe(true)
        expect(
          "min" in assembledTodo.attributes.importance.control &&
            assembledTodo.attributes.importance.control.min,
        ).toBe(0)
        expect(
          "max" in assembledTodo.attributes.importance.control &&
            assembledTodo.attributes.importance.control.max,
        ).toBe(Infinity)
        expect(
          "primary" in assembledTodo.attributes.importance.control &&
            assembledTodo.attributes.importance.control.primary,
        ).toBe(false)

        expect(
          assembledTodo.attributes.importance.orm.sequelize.allowNull,
        ).toBe(true)
        expect(
          "autoIncrement" in
            assembledTodo.attributes.importance.orm.sequelize &&
            assembledTodo.attributes.importance.orm.sequelize.autoIncrement,
        ).toBe(false)
        expect(
          "primaryKey" in assembledTodo.attributes.importance.orm.sequelize &&
            assembledTodo.attributes.importance.orm.sequelize.primaryKey,
        ).toBe(false)
      })
    })
  })
})

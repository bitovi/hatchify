import type { PartialSchema } from "./types"
import { integer } from "../dataTypes"

import { assembler } from "."

describe("assembler", () => {
  describe("assembler", () => {
    const Todo: PartialSchema = {
      name: "Todo",
      id: integer({ required: true, autoIncrement: true }),
      attributes: {
        importance: integer({ min: 0 }),
      },
    }

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
        expect(Todo.id?.control.min).toBeUndefined()
        expect(Todo.id?.control.max).toBeUndefined()
        expect(Todo.id?.control.primary).toBeUndefined()

        expect(Todo.id?.orm.sequelize.allowNull).toBe(false)
        expect(Todo.id?.orm.sequelize.autoIncrement).toBe(true)
        expect(Todo.id?.orm.sequelize.primaryKey).toBeUndefined()

        const { Todo: assembledTodo } = assembler({ Todo })

        expect(assembledTodo.id.control.allowNull).toBe(false)
        expect(assembledTodo.id.control.min).toBe(-Infinity)
        expect(assembledTodo.id.control.max).toBe(Infinity)
        expect(assembledTodo.id.control.primary).toBe(true)

        expect(assembledTodo.id.orm.sequelize.allowNull).toBe(false)
        expect(assembledTodo.id.orm.sequelize.autoIncrement).toBe(true)
        expect(assembledTodo.id.orm.sequelize.primaryKey).toBe(true)
      })

      it("creates id if you did not create one", () => {
        const User: PartialSchema = {
          name: "User",
          attributes: {},
        }

        const { User: assembledUser } = assembler({ User })

        expect(assembledUser.id.control.allowNull).toBe(false)
        expect(assembledUser.id.control.min).toBe(1)
        expect(assembledUser.id.control.max).toBe(Infinity)
        expect(assembledUser.id.control.primary).toBe(true)

        expect(assembledUser.id.orm.sequelize.allowNull).toBe(false)
        expect(assembledUser.id.orm.sequelize.autoIncrement).toBe(true)
        expect(assembledUser.id.orm.sequelize.primaryKey).toBe(true)
      })
    })

    describe("attributes", () => {
      it("finalizes correctly", () => {
        expect(Todo.attributes.importance.control.allowNull).toBeUndefined()
        expect(Todo.attributes.importance.control.min).toBe(0)
        expect(Todo.attributes.importance.control.max).toBeUndefined()
        expect(Todo.attributes.importance.control.primary).toBeUndefined()

        expect(
          Todo.attributes.importance.orm.sequelize.allowNull,
        ).toBeUndefined()
        expect(
          Todo.attributes.importance.orm.sequelize.autoIncrement,
        ).toBeUndefined()
        expect(
          Todo.attributes.importance.orm.sequelize.primaryKey,
        ).toBeUndefined()

        const { Todo: assembledTodo } = assembler({ Todo })

        expect(assembledTodo.attributes.importance.control.allowNull).toBe(true)
        expect(assembledTodo.attributes.importance.control.min).toBe(0)
        expect(assembledTodo.attributes.importance.control.max).toBe(Infinity)
        expect(assembledTodo.attributes.importance.control.primary).toBe(false)

        expect(
          assembledTodo.attributes.importance.orm.sequelize.allowNull,
        ).toBe(true)
        expect(
          assembledTodo.attributes.importance.orm.sequelize.autoIncrement,
        ).toBe(false)
        expect(
          assembledTodo.attributes.importance.orm.sequelize.primaryKey,
        ).toBe(false)
        expect(
          assembledTodo.attributes.importance.orm.sequelize.primaryKey,
        ).toBe(false)
      })
    })
  })
})

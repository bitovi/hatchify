import JSONAPISerializer from "json-api-serializer"

import type { HatchifyModel } from "../types"

import { convertHatchifyModels, createSequelizeInstance } from "."

describe("index", () => {
  describe("convertHatchifyModels", () => {
    const sequelize = createSequelizeInstance()
    const serializer = new JSONAPISerializer()

    const User: HatchifyModel = {
      name: "User",
      attributes: {
        name: "STRING",
      },
      hasMany: [{ target: "Todo", options: { as: "todos" } }],
    }

    const Todo: HatchifyModel = {
      name: "Todo",
      attributes: {
        name: "STRING",
        due_date: "DATE",
        importance: "INTEGER",
      },
      belongsTo: [{ target: "User", options: { as: "user" } }],
    }

    it("works", () => {
      const models = convertHatchifyModels(sequelize, serializer, [Todo, User])

      expect(models).toEqual({
        associationsLookup: {
          Todo: {
            user: {
              joinTable: undefined,
              key: "user_id",
              model: "User",
              type: "belongsTo",
            },
          },
          User: {
            todos: {
              joinTable: undefined,
              key: "todo_id",
              model: "Todo",
              type: "hasMany",
            },
          },
        },
        models: {
          Todo: expect.any(Function),
          User: expect.any(Function),
        },
        virtuals: {},
      })
    })
  })
})

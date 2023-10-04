import JSONAPISerializer from "json-api-serializer"

import { convertHatchifyModels } from "./convertHatchifyModels"
import type { HatchifyModel } from "../../types"
import { createSequelizeInstance } from "../createSequelizeInstance"

describe("convertHatchifyModels", () => {
  const sequelize = createSequelizeInstance()
  const serializer = new JSONAPISerializer()

  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
    },
    hasMany: [{ target: "Todo", options: { as: "todos" } }],
    belongsToMany: [{ target: "UserCategory", options: {} }],
  }

  const UserCategory: HatchifyModel = {
    name: "UserCategory",
    attributes: {
      name: "STRING",
    },
  }

  const Todo: HatchifyModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      dueDate: "DATE",
      importance: "INTEGER",
      status: {
        type: "ENUM",
        values: ["Do Today", "Do Soon", "Done"],
      },
    },
    belongsTo: [{ target: "User", options: { as: "user" } }],
  }

  it("works", () => {
    const models = convertHatchifyModels(sequelize, serializer, [
      Todo,
      User,
      UserCategory,
    ])

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
          userCategorys: {
            joinTable: "UserUserCategory",
            key: "usercategory_id",
            model: "UserCategory",
            type: "belongsToMany",
          },
        },
      },
      models: {
        Todo: expect.any(Function),
        User: expect.any(Function),
        UserCategory: expect.any(Function),
        UserUserCategory: expect.any(Function),
      },
      virtuals: {},
      plurals: {},
    })
  })
})

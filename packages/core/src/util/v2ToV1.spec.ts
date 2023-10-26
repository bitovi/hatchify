import { uuidv4 } from "./uuidv4"
import { v2ToV1 } from "./v2ToV1"
import { datetime, enumerate, integer, string } from "../dataTypes"
import { belongsTo, hasMany } from "../relationships"

describe("v2ToV1", () => {
  it("transforms V2 schemas to V1 schemas - hasMany", () => {
    expect(
      v2ToV1({
        Todo: {
          name: "Todo",
          attributes: {
            name: string(),
            dueDate: datetime(),
            importance: integer(),
            status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
          },
          relationships: {
            user: belongsTo(),
          },
        },
        User: {
          name: "User",
          attributes: {
            name: string(),
          },
          relationships: {
            todos: hasMany(),
          },
        },
      }),
    ).toEqual({
      Todo: {
        name: "Todo",
        attributes: {
          id: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: uuidv4,
          },
          name: {
            type: "STRING",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            typeArgs: [255],
          },
          dueDate: {
            type: "DATE",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
          importance: {
            type: "INTEGER",
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
          status: {
            type: "ENUM",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            values: ["Do Today", "Do Soon", "Done"],
          },
          userId: {
            type: "UUID",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        belongsTo: [
          {
            target: "User",
            options: { as: "user", foreignKey: "userId", targetKey: "id" },
          },
        ],
        belongsToMany: [],
        hasMany: [],
        hasOne: [],
      },
      User: {
        name: "User",
        attributes: {
          id: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: uuidv4,
          },
          name: {
            type: "STRING",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            typeArgs: [255],
          },
        },
        belongsTo: [],
        belongsToMany: [],
        hasMany: [
          {
            target: "Todo",
            options: { as: "todos", foreignKey: "userId", sourceKey: "id" },
          },
        ],
        hasOne: [],
      },
    })
  })

  it("transforms V2 schemas to V1 schemas - hasManyThrough", () => {
    expect(
      v2ToV1({
        Todo: {
          name: "Todo",
          attributes: {
            name: string(),
            dueDate: datetime(),
            importance: integer(),
            status: enumerate({ values: ["Do Today", "Do Soon", "Done"] }),
          },
          relationships: {
            users: hasMany().through(),
          },
        },
        User: {
          name: "User",
          attributes: {
            name: string(),
          },
          relationships: {
            todos: hasMany().through(),
          },
        },
      }),
    ).toEqual({
      Todo: {
        name: "Todo",
        attributes: {
          id: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: uuidv4,
          },
          name: {
            type: "STRING",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            typeArgs: [255],
          },
          dueDate: {
            type: "DATE",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
          status: {
            type: "ENUM",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            values: ["Do Today", "Do Soon", "Done"],
          },
          importance: {
            type: "INTEGER",
            allowNull: true,
            autoIncrement: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        belongsTo: [],
        belongsToMany: [
          {
            target: "User",
            options: {
              as: "users",
              through: "TodoUser",
              foreignKey: "todoId",
              otherKey: "userId",
            },
          },
        ],
        hasMany: [],
        hasOne: [],
      },
      User: {
        name: "User",
        attributes: {
          id: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: uuidv4,
          },
          name: {
            type: "STRING",
            allowNull: true,
            primaryKey: false,
            unique: false,
            defaultValue: null,
            typeArgs: [255],
          },
        },
        belongsTo: [],
        belongsToMany: [
          {
            target: "Todo",
            options: {
              as: "todos",
              through: "TodoUser",
              foreignKey: "userId",
              otherKey: "todoId",
            },
          },
        ],
        hasMany: [],
        hasOne: [],
      },
      TodoUser: {
        name: "TodoUser",
        attributes: {
          id: {
            type: "UUID",
            allowNull: false,
            primaryKey: true,
            unique: true,
            defaultValue: uuidv4,
          },
          userId: {
            type: "UUID",
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
          todoId: {
            type: "UUID",
            allowNull: false,
            primaryKey: false,
            unique: false,
            defaultValue: null,
          },
        },
        belongsTo: [],
        belongsToMany: [],
        hasMany: [],
        hasOne: [],
      },
    })
  })
})

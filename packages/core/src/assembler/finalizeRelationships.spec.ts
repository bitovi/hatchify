import { finalizeRelationships } from "./finalizeRelationships.js"
import { getDefaultPrimaryAttribute } from "./getDefaultPrimaryAttribute.js"
import type { SemiFinalSchema } from "./types.js"
import { integer, string, uuid } from "../dataTypes/index.js"
import { belongsTo, hasMany, hasOne } from "../relationships/index.js"
import { uuidv4 } from "../util/uuidv4.js"

describe("finalizeRelationships", () => {
  it("adds missing attributes and populates nulls - hasMany", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
        },
        readOnly: false,
      },
      User: {
        name: "User",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany(),
        },
        readOnly: false,
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: uuid({ ui: { hidden: true } }).finalize(),
          },
          relationships: {
            ...schemas.Todo.relationships,
            user: {
              type: "belongsTo",
              targetSchema: "User",
              sourceAttribute: "userId",
              targetAttribute: "id",
            },
          },
        },
        User: {
          ...schemas.User,
          relationships: {
            ...schemas.User.relationships,
            todos: {
              type: "hasMany",
              targetSchema: "Todo",
              targetAttribute: "userId",
              sourceAttribute: "id",
            },
          },
        },
      }),
    )
  })

  it("adds missing attributes and populates nulls - hasOne", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
        },
        readOnly: false,
      },
      User: {
        name: "User",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todo: hasOne(),
        },
        readOnly: false,
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: uuid({ ui: { hidden: true } }).finalize(),
          },
          relationships: {
            ...schemas.Todo.relationships,
            user: {
              type: "belongsTo",
              targetSchema: "User",
              sourceAttribute: "userId",
              targetAttribute: "id",
            },
          },
        },
        User: {
          ...schemas.User,
          attributes: {
            ...schemas.User.attributes,
          },
          relationships: {
            ...schemas.User.relationships,
            todo: {
              type: "hasOne",
              targetSchema: "Todo",
              targetAttribute: "userId",
              sourceAttribute: "id",
            },
          },
        },
      }),
    )
  })

  it("adds missing attributes and populates nulls - hasManyThrough", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        ui: {},
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          users: hasMany().through(),
        },
        readOnly: false,
      },
      User: {
        name: "User",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        ui: {},
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany().through(),
        },
        readOnly: true,
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          relationships: {
            ...schemas.Todo.relationships,
            users: {
              type: "hasManyThrough",
              targetSchema: "User",
              through: "TodoUser",
              throughSourceAttribute: "todoId",
              throughTargetAttribute: "userId",
              sourceKey: "id",
              targetKey: "id",
            },
            todoUsers: {
              type: "hasMany",
              targetSchema: "TodoUser",
              targetAttribute: "todoId",
              sourceAttribute: "id",
            },
          },
          readOnly: false,
        },
        User: {
          ...schemas.User,
          relationships: {
            ...schemas.User.relationships,
            todos: {
              type: "hasManyThrough",
              targetSchema: "Todo",
              through: "TodoUser",
              throughSourceAttribute: "userId",
              throughTargetAttribute: "todoId",
              sourceKey: "id",
              targetKey: "id",
            },
            todoUsers: {
              type: "hasMany",
              targetSchema: "TodoUser",
              targetAttribute: "userId",
              sourceAttribute: "id",
            },
          },
          readOnly: true,
        },
        TodoUser: {
          name: "TodoUser",
          id: getDefaultPrimaryAttribute().finalize(),
          ui: {},
          attributes: {
            todoId: uuid({ ui: { hidden: true }, required: true }).finalize(),
            userId: uuid({ ui: { hidden: true }, required: true }).finalize(),
          },
          relationships: {
            todo: {
              type: "belongsTo",
              targetSchema: "Todo",
              sourceAttribute: "todoId",
              targetAttribute: "id",
            },
            user: {
              type: "belongsTo",
              targetSchema: "User",
              sourceAttribute: "userId",
              targetAttribute: "id",
            },
          },
          readOnly: false,
        },
      }),
    )
  })

  it("adds missing attributes and populates nulls - multiple relationships", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
          user2: belongsTo("User"),
        },
        readOnly: false,
      },
      User: {
        name: "User",
        ui: {},
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany(),
        },
        readOnly: false,
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: uuid({ ui: { hidden: true } }).finalize(),
            user2Id: uuid({ ui: { hidden: true } }).finalize(),
          },
          relationships: {
            ...schemas.Todo.relationships,
            user: {
              type: "belongsTo",
              targetSchema: "User",
              sourceAttribute: "userId",
              targetAttribute: "id",
            },
            user2: {
              type: "belongsTo",
              targetSchema: "User",
              sourceAttribute: "user2Id",
              targetAttribute: "id",
            },
          },
        },
        User: {
          ...schemas.User,
          attributes: {
            ...schemas.User.attributes,
          },
          relationships: {
            ...schemas.User.relationships,
            todos: {
              type: "hasMany",
              targetSchema: "Todo",
              targetAttribute: "userId",
              sourceAttribute: "id",
            },
          },
        },
      }),
    )
  })
})

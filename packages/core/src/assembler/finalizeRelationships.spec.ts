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
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
        },
      },
      User: {
        name: "User",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany(),
        },
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: {
              ...uuid({ hidden: true }).finalize(),
              name: "uuid()",
            },
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
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
        },
      },
      User: {
        name: "User",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todo: hasOne(),
        },
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: {
              ...uuid({ hidden: true }).finalize(),
              name: "uuid()",
            },
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
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          users: hasMany().through(),
        },
      },
      User: {
        name: "User",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany().through(),
        },
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
          },
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
          },
        },
        TodoUser: {
          name: "TodoUser",
          id: getDefaultPrimaryAttribute().finalize(),
          attributes: {
            todoId: uuid({ required: true, hidden: true }).finalize(),
            userId: uuid({ required: true, hidden: true }).finalize(),
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
        },
      }),
    )
  })

  it("adds missing attributes and populates nulls - multiple relationships", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
          user2: belongsTo("User"),
        },
      },
      User: {
        name: "User",
        id: uuid({ required: true, default: uuidv4 }).finalize(),
        attributes: {
          name: string().finalize(),
        },
        relationships: {
          todos: hasMany(),
        },
      },
    }

    expect(JSON.stringify(finalizeRelationships(schemas))).toEqual(
      JSON.stringify({
        Todo: {
          ...schemas.Todo,
          attributes: {
            ...schemas.Todo.attributes,
            userId: {
              ...uuid({ hidden: true }).finalize(),
              name: "uuid()",
            },
            user2Id: {
              ...uuid({ hidden: true }).finalize(),
              name: "uuid()",
            },
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

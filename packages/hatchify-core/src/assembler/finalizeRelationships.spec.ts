import { finalizeRelationships } from "./finalizeRelationships"
import type { SemiFinalSchema } from "./types"
import { integer, string } from "../dataTypes"
import { belongsTo, hasMany } from "../relationships"

describe("finalizeRelationships", () => {
  it("adds missing attributes and populates nulls", () => {
    const schemas: Record<string, SemiFinalSchema> = {
      Todo: {
        name: "Todo",
        id: integer({ required: true, autoIncrement: true }).finalize(),
        attributes: {
          importance: integer({ min: 0 }).finalize(),
        },
        relationships: {
          user: belongsTo(),
        },
      },
      User: {
        name: "User",
        id: integer({ required: true, autoIncrement: true }).finalize(),
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
            userId: integer().finalize(),
          },
          relationships: {
            ...schemas.Todo.relationships,
            user: {
              ...schemas.Todo.relationships?.user,
              targetSchema: "User",
              sourceAttribute: "userId",
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
            },
          },
        },
      }),
    )
  })
})

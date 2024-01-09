import { finalize } from "./finalize"
import { integer, string, uuid } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { SemiFinalSchema } from "../../types"
import { uuidv4 } from "../../util/uuidv4"

describe("finalize", () => {
  const schemas: Record<string, SemiFinalSchema> = {
    Todo: {
      name: "Todo",
      ui: {},
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      attributes: {
        importance: integer({ min: 0 }).finalize(),
      },
    },
    User: {
      name: "User",
      ui: {},
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      attributes: {
        name: string().finalize(),
      },
    },
  }

  it("populates targetSchema and targetAttribute", () => {
    const { User, Todo } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: null,
        targetAttribute: null,
        sourceAttribute: null,
        through: jest.fn(),
      },
      "todos",
      schemas,
    )

    expect(Todo.attributes.userId.control.hidden).toEqual(true)
    expect(User.relationships?.todos).toEqual({
      type: "hasMany",
      targetSchema: "Todo",
      targetAttribute: "userId",
      sourceAttribute: "id",
    })
  })

  it("keeps provided targetSchema and targetAttribute", () => {
    const { Todo, User } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: "Todo",
        targetAttribute: "assigneeId",
        sourceAttribute: "id",
        through: jest.fn(),
      },
      "todos",
      schemas,
    )

    expect(Todo.attributes.assigneeId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasMany",
      targetSchema: "Todo",
      targetAttribute: "assigneeId",
      sourceAttribute: "id",
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: "User",
        targetAttribute: "managerId",
        sourceAttribute: "id",
        through: jest.fn(),
      },
      "employees",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()
    expect(User.attributes.managerId.control.hidden).toEqual(true)

    expect(User.relationships?.employees).toEqual({
      type: "hasMany",
      targetSchema: "User",
      targetAttribute: "managerId",
      sourceAttribute: "id",
    })
  })

  it("handles non-existing targetSchema", () => {
    expect(() =>
      finalize(
        "User",
        {
          type: "hasMany",
          targetSchema: "Invalid",
          targetAttribute: null,
          sourceAttribute: null,
          through: jest.fn(),
        },
        "todos",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

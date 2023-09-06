import { finalize } from "./finalize"
import { integer, string } from "../../dataTypes"
import { HatchifyInvalidSchemaError } from "../../types"
import type { SemiFinalSchema } from "../../types"

describe("finalize", () => {
  const schemas: Record<string, SemiFinalSchema> = {
    Todo: {
      name: "Todo",
      id: integer({ required: true, autoIncrement: true }).finalize(),
      attributes: {
        importance: integer({ min: 0 }).finalize(),
      },
    },
    User: {
      name: "User",
      id: integer({ required: true, autoIncrement: true }).finalize(),
      attributes: {
        name: string().finalize(),
      },
    },
  }

  it("populates targetSchema and targetAttribute", () => {
    const { User } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: null,
        targetAttribute: null,
        through: jest.fn(),
      },
      "todos",
      schemas,
    )

    expect(User.relationships?.todos).toEqual({
      type: "hasMany",
      targetSchema: "Todo",
      targetAttribute: "userId",
    })
  })

  it("keeps provided targetSchema and targetAttribute", () => {
    const { Todo, User } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: "Todo",
        targetAttribute: "assigneeId",
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
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "hasMany",
        targetSchema: "User",
        targetAttribute: "managerId",
        through: jest.fn(),
      },
      "employees",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()

    expect(User.relationships?.employees).toEqual({
      type: "hasMany",
      targetSchema: "User",
      targetAttribute: "managerId",
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
          through: jest.fn(),
        },
        "todos",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

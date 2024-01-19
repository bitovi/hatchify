import { finalize } from "./finalize.js"
import { integer, string, uuid } from "../../dataTypes/index.js"
import { HatchifyInvalidSchemaError } from "../../types/index.js"
import type { SemiFinalSchema } from "../../types/index.js"
import { uuidv4 } from "../../util/uuidv4.js"

describe("finalize", () => {
  const schemas: Record<string, SemiFinalSchema> = {
    Todo: {
      name: "Todo",
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      ui: {},
      attributes: {
        importance: integer({ min: 0 }).finalize(),
      },
    },
    User: {
      name: "User",
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      ui: {},
      attributes: {
        name: string().finalize(),
      },
    },
  }

  it("populates targetSchema and targetAttribute", () => {
    const { User, Todo } = finalize(
      "User",
      {
        type: "hasOne",
        targetSchema: null,
        targetAttribute: null,
        sourceAttribute: null,
      },
      "todo",
      schemas,
    )

    expect(Todo.attributes.userId.control.hidden).toEqual(true)
    expect(User.relationships?.todo).toEqual({
      type: "hasOne",
      targetSchema: "Todo",
      targetAttribute: "userId",
      sourceAttribute: "id",
    })
  })

  it("keeps provided targetSchema and targetAttribute", () => {
    const { Todo, User } = finalize(
      "User",
      {
        type: "hasOne",
        targetSchema: "Todo",
        targetAttribute: "assigneeId",
        sourceAttribute: null,
      },
      "todo",
      schemas,
    )

    expect(Todo.attributes.assigneeId).toBeDefined()

    expect(User.relationships?.todo).toEqual({
      type: "hasOne",
      targetSchema: "Todo",
      targetAttribute: "assigneeId",
      sourceAttribute: "id",
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "hasOne",
        targetSchema: "User",
        targetAttribute: "managerId",
        sourceAttribute: null,
      },
      "manager",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()
    expect(User.attributes.managerId.control.hidden).toEqual(true)

    expect(User.relationships?.manager).toEqual({
      type: "hasOne",
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
          type: "hasOne",
          targetSchema: "Invalid",
          targetAttribute: null,
          sourceAttribute: null,
        },
        "todo",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

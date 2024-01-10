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
      attributes: {
        importance: integer({ min: 0 }).finalize(),
      },
    },
    User: {
      name: "User",
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      attributes: {
        name: string().finalize(),
      },
    },
  }

  it("populates targetSchema and sourceAttribute", () => {
    const { Todo } = finalize(
      "Todo",
      {
        type: "belongsTo",
        targetSchema: null,
        sourceAttribute: null,
        targetAttribute: null,
      },
      "user",
      schemas,
    )

    expect(Todo.attributes.userId.control.hidden).toEqual(true)
    expect(Todo.relationships?.user).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "userId",
      targetAttribute: "id",
    })
  })

  it("keeps provided targetSchema and sourceAttribute", () => {
    const { Todo } = finalize(
      "Todo",
      {
        type: "belongsTo",
        targetSchema: "User",
        sourceAttribute: "assigneeId",
        targetAttribute: null,
      },
      "user",
      schemas,
    )

    expect(Todo.attributes.assigneeId).toBeDefined()

    expect(Todo.relationships?.user).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "assigneeId",
      targetAttribute: "id",
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "belongsTo",
        targetSchema: "User",
        sourceAttribute: "managerId",
        targetAttribute: null,
      },
      "manager",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()
    expect(User.attributes.managerId.control.hidden).toEqual(true)

    expect(User.relationships?.manager).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "managerId",
      targetAttribute: "id",
    })
  })

  it("handles non-existing targetSchema", () => {
    expect(() =>
      finalize(
        "Todo",
        {
          type: "belongsTo",
          targetSchema: "Invalid",
          sourceAttribute: null,
          targetAttribute: null,
        },
        "user",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

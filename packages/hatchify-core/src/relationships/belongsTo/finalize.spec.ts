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

  it("populates targetSchema and sourceAttribute", () => {
    const { Todo } = finalize(
      "Todo",
      { type: "belongsTo", targetSchema: null, sourceAttribute: null },
      "user",
      schemas,
    )

    expect(Todo.relationships?.user).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "userId",
    })
  })

  it("keeps provided targetSchema and sourceAttribute", () => {
    const { Todo } = finalize(
      "Todo",
      {
        type: "belongsTo",
        targetSchema: "User",
        sourceAttribute: "assigneeId",
      },
      "user",
      schemas,
    )

    expect(Todo.attributes.assigneeId).toBeDefined()

    expect(Todo.relationships?.user).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "assigneeId",
    })
  })

  it("handles circular relationships", () => {
    const { User } = finalize(
      "User",
      {
        type: "belongsTo",
        targetSchema: "User",
        sourceAttribute: "managerId",
      },
      "manager",
      schemas,
    )

    expect(User.attributes.managerId).toBeDefined()

    expect(User.relationships?.manager).toEqual({
      type: "belongsTo",
      targetSchema: "User",
      sourceAttribute: "managerId",
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
        },
        "user",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

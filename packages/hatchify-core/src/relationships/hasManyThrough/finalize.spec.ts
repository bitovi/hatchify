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

  it("populates targetSchema, through, throughSourceAttribute, throughTargetAttribute, sourceKey and targetKey", () => {
    const { User, TodoUser } = finalize(
      "User",
      {
        type: "hasManyThrough",
        targetSchema: null,
        through: null,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
      },
      "todos",
      schemas,
    )

    expect(TodoUser.attributes.todoId).toBeDefined()
    expect(TodoUser.attributes.userId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasManyThrough",
      targetSchema: "Todo",
      through: "TodoUser",
      throughSourceAttribute: "userId",
      throughTargetAttribute: "todoId",
      sourceKey: "id",
      targetKey: "id",
    })
  })

  it("keeps provided targetSchema", () => {
    const { User, TodoUser } = finalize(
      "User",
      {
        type: "hasManyThrough",
        targetSchema: "Todo",
        through: null,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
      },
      "todos",
      schemas,
    )

    expect(TodoUser.attributes.todoId).toBeDefined()
    expect(TodoUser.attributes.userId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasManyThrough",
      targetSchema: "Todo",
      through: "TodoUser",
      throughSourceAttribute: "userId",
      throughTargetAttribute: "todoId",
      sourceKey: "id",
      targetKey: "id",
    })
  })

  it("keeps provided through", () => {
    const { User, UserTodo } = finalize(
      "User",
      {
        type: "hasManyThrough",
        targetSchema: null,
        through: "UserTodo",
        throughSourceAttribute: null,
        throughTargetAttribute: null,
      },
      "todos",
      schemas,
    )

    expect(UserTodo.attributes.todoId).toBeDefined()
    expect(UserTodo.attributes.userId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasManyThrough",
      targetSchema: "Todo",
      through: "UserTodo",
      throughSourceAttribute: "userId",
      throughTargetAttribute: "todoId",
      sourceKey: "id",
      targetKey: "id",
    })
  })

  it("keeps provided throughSourceAttribute and throughTargetAttribute", () => {
    const { User, TodoUser } = finalize(
      "User",
      {
        type: "hasManyThrough",
        targetSchema: null,
        through: null,
        throughSourceAttribute: "theUserId",
        throughTargetAttribute: "theTodoId",
      },
      "todos",
      schemas,
    )

    expect(TodoUser.attributes.theTodoId).toBeDefined()
    expect(TodoUser.attributes.theUserId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasManyThrough",
      targetSchema: "Todo",
      through: "TodoUser",
      throughSourceAttribute: "theUserId",
      throughTargetAttribute: "theTodoId",
      sourceKey: "id",
      targetKey: "id",
    })
  })

  it("keeps provided sourceKey and targetKey", () => {
    const { User, TodoUser } = finalize(
      "User",
      {
        type: "hasManyThrough",
        targetSchema: null,
        through: null,
        throughSourceAttribute: null,
        throughTargetAttribute: null,
        sourceKey: "userId",
        targetKey: "todoId",
      },
      "todos",
      schemas,
    )

    expect(TodoUser.attributes.todoId).toBeDefined()
    expect(TodoUser.attributes.userId).toBeDefined()

    expect(User.relationships?.todos).toEqual({
      type: "hasManyThrough",
      targetSchema: "Todo",
      through: "TodoUser",
      throughSourceAttribute: "userId",
      throughTargetAttribute: "todoId",
      sourceKey: "userId",
      targetKey: "todoId",
    })
  })

  it("handles non-existing targetSchema", () => {
    expect(() =>
      finalize(
        "User",
        {
          type: "hasManyThrough",
          targetSchema: "Invalid",
          through: null,
          throughSourceAttribute: null,
          throughTargetAttribute: null,
        },
        "todos",
        schemas,
      ),
    ).toThrow(new HatchifyInvalidSchemaError("Schema 'Invalid' is undefined"))
  })
})

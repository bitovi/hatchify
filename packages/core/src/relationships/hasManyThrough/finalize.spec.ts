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
      readOnly: false,
    },
    User: {
      name: "User",
      id: uuid({ required: true, default: uuidv4 }).finalize(),
      attributes: {
        name: string().finalize(),
      },
      readOnly: false,
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

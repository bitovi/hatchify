import type { HatchifyModel } from "@hatchifyjs/node"
import Express from "express"

import { Hatchify } from "./express"
import { GET, POST } from "./testing/utils"

describe("Relationships", () => {
  const User: HatchifyModel = {
    name: "User",
    attributes: {
      name: "STRING",
    },
    hasMany: [{ target: "Todo", options: { as: "todos" } }],
  }

  const Todo: HatchifyModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      due_date: "DATE",
      importance: "INTEGER",
    },
    belongsTo: [{ target: "User", options: { as: "user" } }],
  }

  let server: any
  let hatchify: Hatchify

  beforeAll(async () => {
    const app = Express()
    hatchify = new Hatchify([Todo, User], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    server = app
    await hatchify.createDatabase()
  })

  afterAll(async () => {
    await hatchify.orm.close()
  })

  it("should always return type and id (HATCH-167)", async () => {
    const { serialized: user } = await POST(server, "/api/users", {
      name: "John Doe",
      todos: [
        {
          name: "Walk the dog",
          due_date: "2024-12-12T00:00:00.000Z",
          importance: 6,
        },
      ],
    })

    expect(user).toEqual({
      jsonapi: {
        version: "1.0",
      },
      data: {
        id: "1",
        type: "User",
        attributes: {
          name: "John Doe",
        },
      },
    })

    const { serialized: todosNoFields } = await GET(
      server,
      "/api/todos?include=user",
    )

    expect(todosNoFields).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
            importance: 6,
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
      meta: { unpaginatedCount: 1 },
    })

    const { serialized: todosWithFields } = await GET(
      server,
      "/api/todos?include=user&fields[Todo]=name,due_date&fields[User]=name",
    )

    expect(todosWithFields).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
      meta: { unpaginatedCount: 1 },
    })

    const { serialized: todosWithIdField } = await GET(
      server,
      "/api/todos?include=user&fields[Todo]=id,name,due_date&fields[User]=name",
    )

    expect(todosWithIdField).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
      meta: { unpaginatedCount: 1 },
    })
  })

  describe("should add associations both ways (HATCH-172)", () => {
    it("todo and then user", async () => {
      const { deserialized: todo } = await POST(server, "/api/todos", {
        name: "Walk the dog",
        due_date: "2024-12-12T00:00:00.000Z",
        importance: 6,
      })

      const { deserialized: user } = await POST(server, "/api/users", {
        name: "John Doe",
        todos: [
          {
            id: todo.id,
          },
        ],
      })

      const { serialized: userWithTodo } = await GET(
        server,
        `/api/todos/${todo.id}?include=user`,
      )

      expect(userWithTodo).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Todo",
          id: todo.id,
          attributes: {
            name: todo.name,
            due_date: todo.due_date,
            importance: todo.importance,
          },
          relationships: { user: { data: { type: "User", id: user.id } } },
        },
        included: [
          { type: "User", id: user.id, attributes: { name: user.name } },
        ],
      })
    })

    it("user and then todo", async () => {
      const { deserialized: user } = await POST(server, "/api/users", {
        name: "John Doe",
      })

      const { deserialized: todo } = await POST(server, "/api/todos", {
        name: "Walk the dog",
        due_date: "2024-12-12T00:00:00.000Z",
        importance: 7,
        user: {
          id: user.id,
        },
      })

      const { serialized: userWithTodo } = await GET(
        server,
        `/api/todos/${todo.id}?include=user`,
      )

      expect(userWithTodo).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Todo",
          id: todo.id,
          attributes: {
            name: todo.name,
            due_date: todo.due_date,
            importance: todo.importance,
          },
          relationships: { user: { data: { type: "User", id: user.id } } },
        },
        included: [
          { type: "User", id: user.id, attributes: { name: user.name } },
        ],
      })
    })
  })
})

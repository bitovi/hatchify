import type { HatchifyModel } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

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

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith([User, Todo]))
  })

  afterAll(async () => {
    await teardown()
  })

  it("should always return type and id (HATCH-167)", async () => {
    const { body: user } = await fetch("/api/users", {
      method: "post",
      body: {
        name: "John Doe",
        todos: [
          {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
            importance: 6,
          },
        ],
      },
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

    const { body: todosNoFields } = await fetch("/api/todos?include=user")

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

    const { body: todosWithFields } = await fetch(
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

    const { body: todosWithIdField } = await fetch(
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
      const { body: todo } = await fetch("/api/todos", {
        method: "post",
        body: {
          name: "Walk the dog",
          due_date: "2024-12-12T00:00:00.000Z",
          importance: 6,
        },
      })

      const { body: user } = await fetch("/api/users", {
        method: "post",
        body: {
          name: "John Doe",
          todos: [
            {
              id: todo.data.id,
            },
          ],
        },
      })

      const { body: userWithTodo } = await fetch(
        `/api/todos/${todo.data.id}?include=user`,
      )

      expect(userWithTodo).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Todo",
          id: todo.data.id,
          attributes: {
            name: todo.data.attributes.name,
            due_date: todo.data.attributes.due_date,
            importance: todo.data.attributes.importance,
          },
          relationships: { user: { data: { type: "User", id: user.data.id } } },
        },
        included: [
          {
            type: "User",
            id: user.data.id,
            attributes: { name: user.data.attributes.name },
          },
        ],
      })
    })

    it("user and then todo", async () => {
      const { body: user } = await fetch("/api/users", {
        method: "post",
        body: {
          name: "John Doe",
        },
      })

      const { body: todo } = await fetch("/api/todos", {
        method: "post",
        body: {
          name: "Walk the dog",
          due_date: "2024-12-12T00:00:00.000Z",
          importance: 7,
          user: {
            id: user.data.id,
          },
        },
      })

      const { body: userWithTodo } = await fetch(
        `/api/todos/${todo.data.id}?include=user`,
      )

      expect(userWithTodo).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Todo",
          id: todo.data.id,
          attributes: {
            name: todo.data.attributes.name,
            due_date: todo.data.attributes.due_date,
            importance: todo.data.attributes.importance,
          },
          relationships: { user: { data: { type: "User", id: user.data.id } } },
        },
        included: [
          {
            type: "User",
            id: user.data.id,
            attributes: { name: user.data.attributes.name },
          },
        ],
      })
    })
  })

  describe("should handle validation errors", () => {
    it("should handle non-existing associations", async () => {
      const { status, body } = await fetch("/api/users", {
        method: "post",
        body: {
          name: "John Doe",
          todos: [
            {
              id: "-1",
            },
          ],
        },
      })

      expect(status).toEqual(400)
      expect(body).toEqual([
        {
          code: "invalid-parameter",
          source: {},
          status: 400,
          title: "Todo with ID -1 was not found",
        },
      ])
    })
  })

  describe("should support pagination meta", () => {
    it("with pagination", async () => {
      const [{ body: mrPagination }] = await Promise.all([
        fetch("/api/users", {
          method: "post",
          body: {
            name: "Mr. Pagination",
          },
        }),
        fetch("/api/users", {
          method: "post",
          body: {
            name: "Mrs. Pagination",
          },
        }),
      ])

      const { body: users } = await fetch(
        "/api/users?filter[name]=pagination&page[number]=1&page[size]=1",
      )

      expect(users).toEqual({
        jsonapi: {
          version: "1.0",
        },
        data: [mrPagination.data],
        meta: { unpaginatedCount: 2 },
      })
    })

    it("without pagination", async () => {
      const [{ body: mrPagination }] = await Promise.all([
        fetch("/api/users", {
          method: "post",
          body: {
            name: "Mr. No Pagination",
          },
        }),
      ])

      const { body: users } = await fetch(
        "/api/users?filter[name]=no+pagination",
      )

      expect(users).toEqual({
        jsonapi: {
          version: "1.0",
        },
        data: [mrPagination.data],
        meta: { unpaginatedCount: 1 },
      })
    })
  })
})

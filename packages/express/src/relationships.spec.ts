import { belongsTo, datetime, hasMany, integer, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { startServerWith } from "./testing/utils"

describe("Relationships", () => {
  const User: PartialSchema = {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany(),
    },
  }

  const Todo: PartialSchema = {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
      importance: integer(),
    },
    relationships: {
      user: belongsTo(),
    },
  }

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith({ User, Todo }))
  })

  afterAll(async () => {
    await teardown()
  })

  it("should always return type and id (HATCH-167)", async () => {
    const { body: todo } = await fetch("/api/todos", {
      method: "post",
      body: {
        data: {
          type: "Todo",
          attributes: {
            name: "Walk the dog",
            dueDate: "2024-12-12T00:00:00.000Z",
            importance: 6,
          },
        },
      },
    })

    const { body: user } = await fetch("/api/users", {
      method: "post",
      body: {
        data: {
          type: "User",
          attributes: {
            name: "John Doe",
          },
          relationships: {
            todos: {
              data: [
                {
                  type: "Todo",
                  id: todo.data.id,
                },
              ],
            },
          },
        },
      },
    })

    expect(user).toEqual({
      jsonapi: {
        version: "1.0",
      },
      data: {
        id: user.data.id,
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
          id: todo.data.id,
          attributes: {
            name: "Walk the dog",
            dueDate: "2024-12-12T00:00:00.000Z",
            importance: 6,
            userId: user.data.id,
          },
          relationships: { user: { data: { type: "User", id: user.data.id } } },
        },
      ],
      included: [
        { type: "User", id: user.data.id, attributes: { name: "John Doe" } },
      ],
      meta: { unpaginatedCount: 1 },
    })

    const { body: todosWithFields } = await fetch(
      "/api/todos?include=user&fields[Todo]=name,dueDate&fields[User]=name",
    )

    expect(todosWithFields).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: todo.data.id,
          attributes: {
            name: "Walk the dog",
            dueDate: "2024-12-12T00:00:00.000Z",
          },
          relationships: { user: { data: { type: "User", id: user.data.id } } },
        },
      ],
      included: [
        { type: "User", id: user.data.id, attributes: { name: "John Doe" } },
      ],
      meta: { unpaginatedCount: 1 },
    })

    const { body: todosWithIdField } = await fetch(
      "/api/todos?include=user&fields[Todo]=id,name,dueDate&fields[User]=name",
    )

    expect(todosWithIdField).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: todo.data.id,
          attributes: {
            name: "Walk the dog",
            dueDate: "2024-12-12T00:00:00.000Z",
          },
          relationships: { user: { data: { type: "User", id: user.data.id } } },
        },
      ],
      included: [
        { type: "User", id: user.data.id, attributes: { name: "John Doe" } },
      ],
      meta: { unpaginatedCount: 1 },
    })
  })

  describe("should add associations both ways (HATCH-172)", () => {
    it("todo and then user", async () => {
      const { body: todo } = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "Todo",
            attributes: {
              name: "Walk the dog",
              dueDate: "2024-12-12T00:00:00.000Z",
              importance: 6,
            },
          },
        },
      })

      const { body: user } = await fetch("/api/users", {
        method: "post",
        body: {
          data: {
            type: "User",
            attributes: {
              name: "John Doe",
            },
            relationships: {
              todos: {
                data: [
                  {
                    type: "Todo",
                    id: todo.data.id,
                  },
                ],
              },
            },
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
            dueDate: todo.data.attributes.dueDate,
            importance: todo.data.attributes.importance,
            userId: user.data.id,
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
          data: {
            type: "User",
            attributes: {
              name: "John Doe",
            },
          },
        },
      })

      const { body: todo } = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "Todo",
            attributes: {
              name: "Walk the dog",
              dueDate: "2024-12-12T00:00:00.000Z",
              importance: 7,
            },
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
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
            dueDate: todo.data.attributes.dueDate,
            importance: todo.data.attributes.importance,
            userId: user.data.id,
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

  describe.skip("should handle validation errors (HATCH-186)", () => {
    it("should handle non-existing associations", async () => {
      const { status, body } = await fetch("/api/users", {
        method: "post",
        body: {
          data: {
            type: "User",
            attributes: {
              name: "John Doe",
            },
            relationships: {
              todos: {
                data: [
                  {
                    type: "Todo",
                    id: -1,
                  },
                ],
              },
            },
          },
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

  describe("should support pagination meta (HATCH-203)", () => {
    it("with pagination", async () => {
      const [{ body: mrPagination }] = await Promise.all([
        fetch("/api/users", {
          method: "post",
          body: {
            data: {
              type: "User",
              attributes: {
                name: "Pagination",
              },
            },
          },
        }),
        fetch("/api/users", {
          method: "post",
          body: {
            data: {
              type: "User",
              attributes: {
                name: "Pagination",
              },
            },
          },
        }),
      ])

      const { body: users } = await fetch(
        "/api/users?filter[name]=Pagination&page[number]=1&page[size]=1",
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
            data: {
              type: "User",
              attributes: {
                name: "No Pagination",
              },
            },
          },
        }),
      ])

      const { body: users } = await fetch(
        "/api/users?filter[name]=No+Pagination",
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

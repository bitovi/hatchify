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
    const { body: todo } = await fetch("/api/todos", {
      method: "post",
      body: {
        data: {
          type: "Todo",
          attributes: {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
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

  it("should delete relations included in PATCH request when empty array is sent (HATCH-218)", async () => {
    // add user
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
    expect(user).toEqual({
      jsonapi: {
        version: "1.0",
      },
      data: {
        type: "User",
        id: user.data.id,
        attributes: {
          name: "John Doe",
        },
      },
    })

    // add todo w/ user relation
    const { body: todo } = await fetch("/api/todos", {
      method: "post",
      body: {
        data: {
          type: "Todo",
          attributes: {
            name: "Walk the dog",
            due_date: "2024-12-12T00:00:00.000Z",
            importance: 6,
          },
          relationships: {
            user: {
              data: { type: "User", id: user.data.id },
            },
          },
        },
      },
    })

    expect(todo).toEqual({
      jsonapi: { version: "1.0" },
      data: {
        type: "Todo",
        id: todo.data.id,
        attributes: {
          name: "Walk the dog",
          due_date: "2024-12-12T00:00:00.000Z",
          importance: 6,
        },
      },
    })
    expect(todo).toBeTruthy()

    const { body: patchUserWTodo } = await fetch(`/api/users/${user.data.id}`, {
      method: "patch",
      body: {
        data: {
          type: "User",
          id: user.data.id,
          attributes: {
            name: "John Doe Updated",
          },
          relationships: {
            todos: {
              data: [],
            },
          },
        },
      },
    })
    expect(patchUserWTodo).toBeTruthy()

    // get user with todos
    const { body: userWTodo } = await fetch(
      `/api/users/${user.data.id}?include=todos`,
    )
    expect(userWTodo.data.attributes.name).toEqual("John Doe Updated")
    expect(userWTodo.data.relationships.todos.data).toEqual([])
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
              due_date: "2024-12-12T00:00:00.000Z",
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
              due_date: "2024-12-12T00:00:00.000Z",
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

  describe("should handle validation errors (HATCH-186)", () => {
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
                  {
                    type: "Todo",
                    id: -2,
                  },
                ],
              },
            },
          },
        },
      })

      expect(status).toEqual(404)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [
          {
            status: 404,
            code: "not-found",
            title: "Resource not found.",
            detail: "Payload must include an ID of an existing 'Todo'.",
            source: {
              pointer: "/data/relationships/todos/data/0/id",
            },
          },
          {
            status: 404,
            code: "not-found",
            title: "Resource not found.",
            detail: "Payload must include an ID of an existing 'Todo'.",
            source: {
              pointer: "/data/relationships/todos/data/1/id",
            },
          },
        ],
      })
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
                name: "Mr. Pagination",
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
                name: "Mrs. Pagination",
              },
            },
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
            data: {
              type: "User",
              attributes: {
                name: "Mr. No Pagination",
              },
            },
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

  describe("should handle relationship path errors (HATCH-242)", () => {
    it("should handle relationship paths that can't be identified", async () => {
      const { status, body } = await fetch(
        "/api/todos?include=invalid_relationship_path",
      )

      expect(status).toEqual(400)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [
          {
            status: 400,
            code: "relationship-path",
            title: "Relationship path could not be identified",
            detail: "URL must include an identifiable relationship path",
            source: {
              parameter: "include",
            },
          },
        ],
      })
    })
  })
})

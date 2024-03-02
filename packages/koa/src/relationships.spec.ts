import {
  belongsTo,
  datetime,
  hasMany,
  integer,
  string,
  uuid,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { dbDialects, startServerWith } from "./testing/utils.js"

describe.each(dbDialects)("Relationships", (dialect) => {
  describe(`${dialect} - Users and Todos`, () => {
    const User = {
      name: "User",
      attributes: {
        name: string(),
        age: integer(),
      },
      relationships: {
        todos: hasMany(),
      },
    } satisfies PartialSchema
    const Todo = {
      name: "Todo",
      attributes: {
        name: string(),
        dueDate: datetime(),
        importance: integer(),
      },
      relationships: {
        user: belongsTo(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, teardown } = await startServerWith({ User, Todo }, dialect))
    })

    afterAll(async () => {
      await teardown()
    })

    it("does not crash on nested includes", async () => {
      const { body } = await fetch(
        "/api/todos?include=user,user.todos&page[size]=1&page[number]=1",
      )

      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        data: [],
        meta: { unpaginatedCount: 0 },
      })
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
              age: 18,
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
          id: expect.any(String),
          type: "User",
          attributes: {
            name: "John Doe",
            age: 18,
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
          },
        ],
        included: [
          {
            type: "User",
            id: user.data.id,
            attributes: { name: "John Doe", age: 18 },
          },
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
            relationships: {
              user: { data: { type: "User" } },
            },
          },
        ],
        included: [
          {
            type: "User",
            attributes: { name: "John Doe" },
          },
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
            relationships: {
              user: { data: { type: "User" } },
            },
          },
        ],
        included: [
          {
            type: "User",
            attributes: { name: "John Doe" },
          },
        ],
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
              age: 18,
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
            age: 18,
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
              dueDate: "2024-12-12T00:00:00.000Z",
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
            dueDate: "2024-12-12T00:00:00.000Z",
            importance: 6,
            ...(dialect === "sqlite" ? {} : { userId: null }),
          },
        },
      })
      expect(todo).toBeTruthy()

      const { body: patchUserWTodo } = await fetch(
        `/api/users/${user.data.id}`,
        {
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
        },
      )
      expect(patchUserWTodo).toBeTruthy()

      // get user with todos
      const { body: userWTodo } = await fetch(
        `/api/users/${user.data.id}?include=todos`,
      )
      expect(userWTodo.data.attributes.name).toEqual("John Doe Updated")
      expect(userWTodo.data.relationships.todos.data).toEqual([])
    })

    it("sorts by fields included from relationships", async () => {
      // add user
      const userIds: string[] = []
      const todoIds: string[] = []
      const userNames = ["John Doe", "Richard Roe", "Captain Slow"]
      for (const name of userNames) {
        userIds.push(
          (
            await fetch("/api/users", {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name,
                  },
                },
              },
            })
          ).body.data.id,
        )
      }

      for (const userId of userIds) {
        todoIds.push(
          (
            await fetch("/api/todos", {
              method: "post",
              body: {
                data: {
                  type: "Todo",
                  attributes: {
                    name: "Walk the dog" + userId,
                    dueDate: "2024-12-12T00:00:00.000Z",
                    importance: 6,
                  },
                  relationships: {
                    user: {
                      data: { type: "User", id: userId },
                    },
                  },
                },
              },
            })
          ).body.data.id,
        )
      }

      interface UserIncluded {
        id: string
        attributes: typeof User.attributes
      }
      interface TodoResult {
        data: {
          id: string
        }
        relationships: {
          [key: string]: {
            data: {
              id: string
            }
          }
        }
      }
      interface TodoBody {
        data: TodoResult[]
        included: UserIncluded[]
      }

      // add todo w/ user relation
      const { body: todos }: { body: TodoBody } = await fetch(
        `/api/todos?${todoIds
          .map((todoId) => `filter[id][$in][]=${todoId}`)
          .join("&")}&include=user&sort=user.name`,
      )

      const usersById = todos.included.reduce(
        (
          acc: { [key: string]: UserIncluded },
          user: UserIncluded,
        ): { [key: string]: UserIncluded } => ({
          ...acc,
          [user.id]: user,
        }),
        {},
      )

      const usersInOrder = todos.data.map((todo) => {
        return usersById[todo.relationships.user.data.id].attributes.name
      })
      expect(usersInOrder).toEqual(userNames.sort())

      // descending case
      const { body: todosDesc }: { body: TodoBody } = await fetch(
        `/api/todos?${todoIds
          .map((todoId) => `filter[id][$in][]=${todoId}`)
          .join("&")}&include=user&sort=-user.name`,
      )

      const usersByIdDesc = todosDesc.included.reduce(
        (
          acc: { [key: string]: UserIncluded },
          user: UserIncluded,
        ): { [key: string]: UserIncluded } => ({
          ...acc,
          [user.id]: user,
        }),
        {},
      )

      const usersInOrderDesc = todosDesc.data.map((todo) => {
        return usersByIdDesc[todo.relationships.user.data.id].attributes.name
      })
      expect(usersInOrderDesc).toEqual(userNames.sort().reverse())
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
                age: 18,
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
          },
          included: [
            {
              type: "User",
              id: user.data.id,
              attributes: {
                name: user.data.attributes.name,
                age: user.data.attributes.age,
              },
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
                age: 18,
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
          },
          included: [
            {
              type: "User",
              id: user.data.id,
              attributes: {
                name: user.data.attributes.name,
                age: user.data.attributes.age,
              },
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
                      id: "00000000-0000-0000-0000-000000000001",
                    },
                    {
                      type: "Todo",
                      id: "00000000-0000-0000-0000-000000000002",
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

      it("should handle non-included nested associations", async () => {
        const { status, body } = await fetch(
          "/api/users?filter[todos.name]=test",
        )

        expect(status).toEqual(400)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 400,
              code: "relationship-path",
              title: "Relationship path could not be identified.",
              detail:
                "URL must have 'include' with 'todos' as one of the relationships to include.",
              source: {
                parameter: "include",
              },
            },
          ],
        })
      })

      it("should handle non-existing nested associations", async () => {
        const { status, body } = await fetch(
          "/api/users?include=todos,todos.invalid",
        )

        expect(status).toEqual(400)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 400,
              code: "relationship-path",
              title: "Relationship path could not be identified.",
              detail:
                "URL must have 'include' where 'todos.invalid' is a valid relationship path.",
              source: {
                parameter: "include",
              },
            },
          ],
        })
      })
    })

    describe("should support pagination meta (HATCH-203)", () => {
      it("with pagination", async () => {
        const { body: mrPagination } = await fetch("/api/users", {
          method: "post",
          body: {
            data: {
              type: "User",
              attributes: {
                name: "Pagination",
                age: 18,
              },
            },
          },
        })

        await fetch("/api/users", {
          method: "post",
          body: {
            data: {
              type: "User",
              attributes: {
                name: "Pagination",
                age: 19,
              },
            },
          },
        })

        const { body: users } = await fetch(
          `/api/users?filter[name]=Pagination&page[number]=1&page[size]=1&sort=age`,
        )

        expect(users).toEqual({
          jsonapi: {
            version: "1.0",
          },
          data: [{ ...mrPagination.data, id: expect.any(String) }],
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
                  age: 18,
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

    describe("should handle relationship path errors (HATCH-242)", () => {
      it("should handle relationship parameters that can't be identified", async () => {
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
              title: "Relationship path could not be identified.",
              detail:
                "URL must have 'include' where 'invalid_relationship_path' is a valid relationship path.",
              source: {
                parameter: "include",
              },
            },
          ],
        })
      })

      it("should handle relationship associations that can't be identified", async () => {
        const { status, body } = await fetch("/api/users", {
          method: "post",
          body: {
            data: {
              type: "User",
              attributes: {
                name: "John Doe",
              },
              relationships: {
                todonts: {
                  data: [
                    {
                      type: "Todo",
                      id: 1,
                    },
                  ],
                },
              },
            },
          },
        })

        expect(status).toEqual(400)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 400,
              code: "relationship-path",
              title: "Relationship path could not be identified.",
              detail: "Payload must include an identifiable relationship path.",
              source: {
                pointer: "/data/relationships/todonts",
              },
            },
          ],
        })
      })
    })

    it("should allow relationship filtering (HATCH-376)", async () => {
      const todos = await Promise.all(
        [1, 2].map((importance) =>
          fetch("/api/todos", {
            method: "post",
            body: {
              data: {
                type: "Todo",
                attributes: {
                  name: "Walk the dog",
                  dueDate: "2024-12-12T00:00:00.000Z",
                  importance,
                },
              },
            },
          }),
        ),
      )
      const { body: user } = await fetch("/api/users", {
        method: "post",
        body: {
          data: {
            type: "User",
            attributes: {
              name: "John",
              age: 18,
            },
            relationships: {
              todos: {
                data: todos.map(
                  ({
                    body: {
                      data: { id },
                    },
                  }) => ({
                    type: "Todo",
                    id,
                  }),
                ),
              },
            },
          },
        },
      })
      const { body } = await fetch(
        "/api/todos?include=user&filter[importance][$eq]=1&filter[name][$ilike]=walk%25&filter[user.name][$ilike]=john%25",
      )

      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "Todo",
            id: todos[0].body.data.id,
            attributes: {
              name: "Walk the dog",
              dueDate: "2024-12-12T00:00:00.000Z",
              importance: 1,
              userId: user.data.id,
            },
            relationships: {
              user: {
                data: {
                  type: "User",
                  id: user.data.id,
                },
              },
            },
          },
        ],
        included: [
          {
            type: "User",
            id: user.data.id,
            attributes: {
              name: "John",
              age: 18,
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })

    it("should allow relationship sorting (HATCH-491)", async () => {
      const todos = await Promise.all(
        ["2024-01-01T00:00:00.000Z", "2024-01-02T00:00:00.000Z"].map(
          async (dueDate) => {
            const { body } = await fetch("/api/todos", {
              method: "post",
              body: {
                data: {
                  type: "Todo",
                  attributes: {
                    name: "Jogging",
                    dueDate,
                    importance: 1,
                  },
                },
              },
            })

            return body
          },
        ),
      )

      const { body: user } = await fetch("/api/users", {
        method: "post",
        body: {
          data: {
            type: "User",
            attributes: {
              name: "Mosh",
              age: 18,
            },
            relationships: {
              todos: {
                data: todos.map(({ data: { id } }) => ({
                  type: "Todo",
                  id,
                })),
              },
            },
          },
        },
      })
      const { body } = await fetch(
        "/api/users?include=todos&filter[name]=Mosh&sort=-todos.dueDate",
      )

      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        meta: { unpaginatedCount: 2 },
        data: [
          {
            type: "User",
            id: user.data.id,
            attributes: { name: "Mosh", age: 18 },
            relationships: {
              todos: {
                data: [
                  { type: "Todo", id: todos[1].data.id },
                  { type: "Todo", id: todos[0].data.id },
                ],
              },
            },
          },
        ],
        included: [
          {
            ...todos[1].data,
            attributes: {
              ...todos[1].data.attributes,
              userId: user.data.id,
            },
          },
          {
            ...todos[0].data,
            attributes: {
              ...todos[0].data.attributes,
              userId: user.data.id,
            },
          },
        ],
      })
    })
  })

  describe(`${dialect} - No Relationships`, () => {
    const Todo = {
      name: "Todo",
      attributes: {
        name: string(),
        dueDate: datetime(),
        importance: integer(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, teardown } = await startServerWith({ Todo }, dialect))
    })

    afterAll(async () => {
      await teardown()
    })

    describe("should handle relationship path errors (HATCH-242)", () => {
      it("should handle relationship paths when model has no relationships", async () => {
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
              title: "Relationship path could not be identified.",
              detail:
                "URL must have 'include' where 'invalid_relationship_path' is a valid relationship path.",
              source: {
                parameter: "include",
              },
            },
          ],
        })
      })
    })
  })

  describe(`${dialect} - Accounts and Sales People`, () => {
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPersons: hasMany().through(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("assumes camelCase when 'as' is not provided", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Bitovi",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              accounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })

      const { body: accountWithSalesPersons } = await fetch(
        `/api/accounts/${account.data.id}?include=salesPersons`,
      )

      expect(accountWithSalesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Account",
          id: account.data.id,
          attributes: {
            name: account.data.attributes.name,
          },
          relationships: {
            salesPersons: {
              data: [{ type: "SalesPerson", id: salesPerson.data.id }],
            },
          },
        },
        included: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: salesPerson.data.attributes.firstName,
            },
          },
        ],
      })
    })
  })

  describe(`${dialect} - Aliased belongsToMany relationships`, () => {
    const SalesPerson = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        aliasedAccounts: hasMany("Account").through(null, {
          throughSourceAttribute: "salesPersonId",
          throughTargetAttribute: "accountId",
        }),
      },
    } satisfies PartialSchema
    const Account = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        aliasedSalesPersons: hasMany("SalesPerson").through(null, {
          throughSourceAttribute: "accountId",
          throughTargetAttribute: "salesPersonId",
        }),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, teardown } = await startServerWith(
        { SalesPerson, Account },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("returns correct results when 'as' is provided", async () => {
      const { body: account } = await fetch("/api/accounts", {
        method: "post",
        body: {
          data: {
            type: "Account",
            attributes: {
              name: "Bitovi",
            },
          },
        },
      })
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {
              firstName: "John",
            },
            relationships: {
              aliasedAccounts: {
                data: [
                  {
                    type: "Account",
                    id: account.data.id,
                  },
                ],
              },
            },
          },
        },
      })

      const { body: accountWithSalesPersons } = await fetch(
        `/api/accounts/${account.data.id}?include=aliasedSalesPersons`,
      )

      expect(accountWithSalesPersons).toEqual({
        jsonapi: { version: "1.0" },
        data: {
          type: "Account",
          id: account.data.id,
          attributes: {
            name: account.data.attributes.name,
          },
          relationships: {
            aliasedSalesPersons: {
              data: [{ type: "SalesPerson", id: salesPerson.data.id }],
            },
          },
        },
        included: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            attributes: {
              firstName: salesPerson.data.attributes.firstName,
            },
          },
        ],
      })
    })
  })

  describe(`${dialect} - Accounts and Sales People (HATCH-513)`, () => {
    const Account = {
      name: "Account",
      attributes: {},
      relationships: {
        salesPeople: hasMany("SalesPerson").through("AccountSalesPerson"),
      },
    } satisfies PartialSchema

    const SalesPerson = {
      name: "SalesPerson",
      attributes: {},
      relationships: {
        salesAccounts: hasMany("Account").through("AccountSalesPerson"),
      },
    } satisfies PartialSchema

    const AccountSalesPerson = {
      name: "AccountSalesPerson",
      attributes: {
        accountId: uuid(),
        salesPersonId: uuid(),
      },
    } satisfies PartialSchema

    let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
    let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

    beforeAll(async () => {
      ;({ fetch, teardown } = await startServerWith(
        { SalesPerson, Account, AccountSalesPerson },
        dialect,
      ))
    })

    afterAll(async () => {
      await teardown()
    })

    it("does not crash", async () => {
      const { body: salesPerson } = await fetch("/api/sales-persons", {
        method: "post",
        body: {
          data: {
            type: "SalesPerson",
            attributes: {},
          },
        },
      })

      const { status, body: salesPeople } = await fetch(
        "/api/sales-persons?include=salesAccounts,accountSalesPersons",
      )

      expect(status).toBe(200)
      expect(salesPeople).toEqual({
        jsonapi: { version: "1.0" },
        data: [
          {
            type: "SalesPerson",
            id: salesPerson.data.id,
            relationships: {
              salesAccounts: {
                data: [],
              },
              accountSalesPersons: {
                data: [],
              },
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })
  })
})

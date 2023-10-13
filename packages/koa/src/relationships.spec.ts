import { belongsTo, datetime, hasMany, integer, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { dbDialects, startServerWith } from "./testing/utils"

describe.each(dbDialects)("Relationships", (dialect) => {
  describe(`${dialect} - Users and Todos`, () => {
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
      ;({ fetch, teardown } = await startServerWith({ User, Todo }, dialect))
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
          id: expect.any(String),
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
          },
        ],
        included: [
          { type: "User", id: user.data.id, attributes: { name: "John Doe" } },
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
            relationships: {
              user: { data: { type: "User", id: user.data.id } },
            },
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
          `/api/users?filter[name]=Pagination&page[number]=1&page[size]=1`,
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
              detail: "URL must have 'include' as one or more of 'user'.",
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
            },
          },
        ],
        meta: { unpaginatedCount: 1 },
      })
    })
  })

  describe(`${dialect} - No Relationships`, () => {
    const Todo: PartialSchema = {
      name: "Todo",
      attributes: {
        name: string(),
        dueDate: datetime(),
        importance: integer(),
      },
    }

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
              detail: "URL must not have 'include' as a parameter.",
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
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        accounts: hasMany().through(),
      },
    }
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        salesPersons: hasMany().through(),
      },
    }

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
    const SalesPerson: PartialSchema = {
      name: "SalesPerson",
      attributes: {
        firstName: string(),
      },
      relationships: {
        aliasedAccounts: hasMany("Account").through({
          throughSourceAttribute: "salesPersonId",
          throughTargetAttribute: "accountId",
        }),
      },
    }
    const Account: PartialSchema = {
      name: "Account",
      attributes: {
        name: string(),
      },
      relationships: {
        aliasedSalesPersons: hasMany("SalesPerson").through({
          throughSourceAttribute: "accountId",
          throughTargetAttribute: "salesPersonId",
        }),
      },
    }

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
})

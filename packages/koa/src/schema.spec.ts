import {
  belongsTo,
  boolean,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
  text,
} from "@hatchifyjs/hatchify-core"
import type { HatchifyModel, PartialSchema } from "@hatchifyjs/node"

import {
  dbDialects,
  getDatabaseColumns,
  startServerWith,
} from "./testing/utils"

describe.each(dbDialects)("schema", (dialect) => {
  describe(`${dialect}`, () => {
    describe("v1", () => {
      const Todo: HatchifyModel = {
        name: "Todo",
        attributes: {
          name: "STRING",
        },
        belongsTo: [{ target: "User", options: { as: "user" } }],
      }

      const User: HatchifyModel = {
        name: "User",
        attributes: {
          name: { type: "STRING", validate: { len: [1, 10] } },
          age: { type: "INTEGER", validate: { min: 0 } },
          yearsWorked: { type: "INTEGER", validate: { min: 0 } },
          hireDate: {
            type: "DATE",
            validate: { isAfter: "2022-12-31T00:00:00.000Z" },
          },
          bio: "TEXT",
          status: {
            type: "ENUM",
            values: ["active", "inactive"],
          },
          isDeleted: "BOOLEAN",
        },
        hasMany: [{ target: "Todo", options: { as: "todos" } }],
      }

      let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
      let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
      let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
      let todoId: number

      beforeAll(async () => {
        ;({ fetch, hatchify, teardown } = await startServerWith(
          [Todo, User],
          dialect,
        ))
        ;({
          body: {
            data: { id: todoId },
          },
        } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: { type: "Todo", attributes: { name: "Test", userId: null } },
          },
        }))
      })

      afterAll(async () => {
        await fetch(`/api/todos/${todoId}`, {
          method: "delete",
        })

        await teardown()
      })

      it("should create a snake_case table with id, name, age, years_worked and hire_date columns", async () => {
        const sortedColumns = await getDatabaseColumns(hatchify, "user")

        expect(sortedColumns).toEqual([
          {
            name: "age",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "bio",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "text" : "TEXT",
          },
          {
            name: "hire_date",
            allowNull: true,
            primary: false,
            type:
              dialect === "postgres" ? "timestamp with time zone" : "DATETIME",
          },
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "is_deleted",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "boolean" : "TINYINT(1)",
          },
          {
            name: "name",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "character varying" : "VARCHAR(255)",
          },
          {
            name: "status",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "USER-DEFINED" : "TEXT",
          },
          {
            name: "years_worked",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ])
      })

      describe("should have API with core features working", () => {
        let postStatus1: number
        let postUser1: any
        let postStatus2: number
        let postUser2: any

        beforeAll(async () => {
          ;({ status: postStatus1, body: postUser1 } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "John Doe",
                    age: 21,
                    yearsWorked: 1,
                    hireDate: "2023-01-01T00:00:00.000Z",
                    bio: "bla bla",
                    status: "active",
                    isDeleted: true,
                  },
                  relationships: {
                    todos: {
                      data: [
                        {
                          type: "Todo",
                          id: todoId.toString(),
                        },
                      ],
                    },
                  },
                },
              },
            },
          ))
          ;({ status: postStatus2, body: postUser2 } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "Jane Doe",
                    age: 22,
                    yearsWorked: 3,
                    hireDate: "2023-01-01T00:00:00.000Z",
                    bio: "bla bla",
                    status: "active",
                    isDeleted: false,
                  },
                },
              },
            },
          ))
        })

        afterAll(async () => {
          await Promise.all([
            fetch(`/api/users/${postUser1.data.id}`, { method: "delete" }),
            fetch(`/api/users/${postUser2.data.id}`, { method: "delete" }),
          ])
        })

        it("supports user creation", async () => {
          expect(postStatus1).toBe(200)
          expect(postUser1).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "1",
              type: "User",
              attributes: {
                name: "John Doe",
                age: 21,
                yearsWorked: 1,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: true,
              },
            },
          })

          expect(postStatus2).toBe(200)
          expect(postUser2).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "2",
              type: "User",
              attributes: {
                name: "Jane Doe",
                age: 22,
                yearsWorked: 3,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: false,
              },
            },
          })
        })

        it("validates name, age, yearsWorked and hireDate", async () => {
          const { status: postStatus, body: postUser } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "",
                    age: -1,
                    yearsWorked: -1,
                    hireDate: "2022-01-01T00:00:00.000Z",
                    status: "invalid",
                    isDeleted: "invalid",
                  },
                },
              },
            },
          )

          expect(postStatus).toBe(500)
          expect(postUser).toEqual({
            jsonapi: { version: "1.0" },
            errors: [
              {
                name: "SequelizeValidationError",
                errors: [
                  {
                    message: "Validation len on name failed",
                    type: "Validation error",
                    path: "name",
                    value: "",
                    origin: "FUNCTION",
                    instance: {
                      id: null,
                      name: "",
                      age: -1,
                      yearsWorked: -1,
                      hireDate: "2022-01-01T00:00:00.000Z",
                      status: "invalid",
                      isDeleted: "invalid",
                    },
                    validatorKey: "len",
                    validatorName: "len",
                    validatorArgs: [1, 10],
                    original: { validatorName: "len", validatorArgs: [1, 10] },
                  },
                  {
                    message: "Validation min on age failed",
                    type: "Validation error",
                    path: "age",
                    value: -1,
                    origin: "FUNCTION",
                    instance: {
                      id: null,
                      name: "",
                      age: -1,
                      yearsWorked: -1,
                      hireDate: "2022-01-01T00:00:00.000Z",
                      status: "invalid",
                      isDeleted: "invalid",
                    },
                    validatorKey: "min",
                    validatorName: "min",
                    validatorArgs: [0],
                    original: { validatorName: "min", validatorArgs: [0] },
                  },
                  {
                    message: "Validation min on yearsWorked failed",
                    type: "Validation error",
                    path: "yearsWorked",
                    value: -1,
                    origin: "FUNCTION",
                    instance: {
                      id: null,
                      name: "",
                      age: -1,
                      yearsWorked: -1,
                      hireDate: "2022-01-01T00:00:00.000Z",
                      status: "invalid",
                      isDeleted: "invalid",
                    },
                    validatorKey: "min",
                    validatorName: "min",
                    validatorArgs: [0],
                    original: { validatorName: "min", validatorArgs: [0] },
                  },
                  {
                    message: "Validation isAfter on hireDate failed",
                    type: "Validation error",
                    path: "hireDate",
                    value: "2022-01-01T00:00:00.000Z",
                    origin: "FUNCTION",
                    instance: {
                      id: null,
                      name: "",
                      age: -1,
                      yearsWorked: -1,
                      hireDate: "2022-01-01T00:00:00.000Z",
                      status: "invalid",
                      isDeleted: "invalid",
                    },
                    validatorKey: "isAfter",
                    validatorName: "isAfter",
                    validatorArgs: ["2022-12-31T00:00:00.000Z"],
                    original: {
                      validatorName: "isAfter",
                      validatorArgs: ["2022-12-31T00:00:00.000Z"],
                    },
                  },
                  {
                    message: "Validation isIn on status failed",
                    type: "Validation error",
                    path: "status",
                    value: "invalid",
                    origin: "FUNCTION",
                    instance: {
                      id: null,
                      name: "",
                      age: -1,
                      yearsWorked: -1,
                      hireDate: "2022-01-01T00:00:00.000Z",
                      status: "invalid",
                      isDeleted: "invalid",
                    },
                    validatorKey: "isIn",
                    validatorName: "isIn",
                    validatorArgs: [["active", "inactive"]],
                    original: {
                      validatorName: "isIn",
                      validatorArgs: [["active", "inactive"]],
                    },
                  },
                ],
              },
            ],
          })
        })

        it("supports listing all users", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports filtering users by age", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?filter[age][$eq]=22",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
            ],
            meta: {
              unpaginatedCount: 1,
            },
          })
        })

        it("supports fields", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?fields[user]=yearsWorked",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  yearsWorked: 1,
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  yearsWorked: 3,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports sorting", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?sort=-yearsWorked",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports pagination", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?page[size]=1&page[number]=1",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports include", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?include=todos",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: { version: "1.0" },
            data: [
              {
                type: "User",
                id: "1",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
                relationships: { todos: { data: [{ type: "Todo", id: "1" }] } },
              },
              {
                type: "User",
                id: "2",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
                relationships: { todos: { data: [] } },
              },
            ],
            included: [
              {
                type: "Todo",
                id: "1",
                attributes: {
                  name: "Test",
                },
              },
            ],
            meta: { unpaginatedCount: 2 },
          })
        })
      })
    })

    describe("v2", () => {
      const Todo: PartialSchema = {
        name: "Todo",
        attributes: {
          name: string(),
        },
        relationships: {
          user: belongsTo(),
        },
      }

      const User: PartialSchema = {
        name: "User",
        attributes: {
          name: string({ min: 1, max: 10 }),
          age: integer({ min: 0 }),
          yearsWorked: integer({ min: 0 }),
          hireDate: datetime({ min: new Date("2022-12-31T00:00:00.000Z") }),
          bio: text(),
          status: enumerate({ values: ["active", "inactive"] }),
          isDeleted: boolean(),
        },
        relationships: {
          todos: hasMany(),
        },
      }

      let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
      let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
      let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]
      let todoId: number

      beforeAll(async () => {
        ;({ fetch, hatchify, teardown } = await startServerWith(
          { Todo, User },
          dialect,
        ))
        ;({
          body: {
            data: { id: todoId },
          },
        } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: { type: "Todo", attributes: { name: "Test", userId: null } },
          },
        }))
      })

      afterAll(async () => {
        await fetch(`/api/todos/${todoId}`, {
          method: "delete",
        })

        await teardown()
      })

      it("should create a snake_case table with id, age, years_worked and hired_date columns", async () => {
        const sortedColumns = await getDatabaseColumns(hatchify, "user")

        expect(sortedColumns).toEqual([
          {
            name: "age",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "bio",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "text" : "TEXT",
          },
          {
            name: "hire_date",
            allowNull: true,
            primary: false,
            type:
              dialect === "postgres" ? "timestamp with time zone" : "DATETIME",
          },
          {
            name: "id",
            allowNull: dialect === "sqlite",
            primary: true,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "is_deleted",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "boolean" : "TINYINT(1)",
          },
          {
            name: "name",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "character varying" : "VARCHAR(10)",
          },
          {
            name: "status",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "USER-DEFINED" : "TEXT",
          },
          {
            name: "years_worked",
            allowNull: true,
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
        ])
      })

      describe("should have API with core features working", () => {
        let postStatus1: number
        let postUser1: any
        let postStatus2: number
        let postUser2: any

        beforeAll(async () => {
          ;({ status: postStatus1, body: postUser1 } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "John Doe",
                    age: 21,
                    yearsWorked: 1,
                    hireDate: "2023-01-01T00:00:00.000Z",
                    bio: "bla bla",
                    status: "active",
                    isDeleted: true,
                  },
                  relationships: {
                    todos: {
                      data: [
                        {
                          type: "Todo",
                          id: todoId.toString(),
                        },
                      ],
                    },
                  },
                },
              },
            },
          ))
          ;({ status: postStatus2, body: postUser2 } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "Jane Doe",
                    age: 22,
                    yearsWorked: 3,
                    hireDate: "2023-01-01T00:00:00.000Z",
                    bio: "bla bla",
                    status: "active",
                    isDeleted: false,
                  },
                },
              },
            },
          ))
        })

        afterAll(async () => {
          await Promise.all([
            fetch(`/api/users/${postUser1.data.id}`, { method: "delete" }),
            fetch(`/api/users/${postUser2.data.id}`, { method: "delete" }),
          ])
        })

        it("supports user creation", async () => {
          expect(postStatus1).toBe(200)
          expect(postUser1).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "1",
              type: "User",
              attributes: {
                name: "John Doe",
                age: 21,
                yearsWorked: 1,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: true,
              },
            },
          })

          expect(postStatus2).toBe(200)
          expect(postUser2).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: "2",
              type: "User",
              attributes: {
                name: "Jane Doe",
                age: 22,
                yearsWorked: 3,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: false,
              },
            },
          })
        })

        it("validates name, age, yearsWorked and hireDate", async () => {
          const { status: postStatus, body: postUser } = await fetch(
            "/api/users",
            {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "",
                    age: -1,
                    yearsWorked: -1,
                    hireDate: "2022-01-01T00:00:00.000Z",
                    status: "invalid",
                    isDeleted: "invalid",
                  },
                },
              },
            },
          )

          expect(postStatus).toBe(422)
          expect(postUser).toEqual({
            jsonapi: { version: "1.0" },
            errors: [
              {
                status: 422,
                code: "unexpected-value",
                detail:
                  "Payload must have 'name' with length greater than or equal to 1 but received '' instead.",
                source: { pointer: "/data/attributes/name" },
                title: "Unexpected value.",
              },
              {
                status: 422,
                code: "unexpected-value",
                title: "Unexpected value.",
                detail:
                  "Payload must have 'age' greater than or equal to 0 but received '-1' instead.",
                source: {
                  pointer: "/data/attributes/age",
                },
              },
              {
                status: 422,
                code: "unexpected-value",
                title: "Unexpected value.",
                detail:
                  "Payload must have 'yearsWorked' greater than or equal to 0 but received '-1' instead.",
                source: {
                  pointer: "/data/attributes/yearsWorked",
                },
              },
              {
                status: 422,
                code: "unexpected-value",
                detail: expect.stringMatching(
                  /Payload must have 'hireDate' after or on 2022-12-31T00:00:00\.000Z but received '(.*?)' instead\./,
                ),
                source: { pointer: "/data/attributes/hireDate" },
                title: "Unexpected value.",
              },
              {
                status: 422,
                code: "unexpected-value",
                detail:
                  "Payload must have 'status' as one of 'active', 'inactive' but received 'invalid' instead.",
                source: { pointer: "/data/attributes/status" },
                title: "Unexpected value.",
              },
              {
                status: 422,
                code: "unexpected-value",
                detail:
                  "Payload must have 'isDeleted' as a boolean but received 'invalid' instead.",
                source: { pointer: "/data/attributes/isDeleted" },
                title: "Unexpected value.",
              },
            ],
          })
        })

        it("supports listing all users", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports filtering users by age", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?filter[age][$eq]=22",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
            ],
            meta: {
              unpaginatedCount: 1,
            },
          })
        })

        it("supports fields", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?fields[user]=yearsWorked",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  yearsWorked: 1,
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  yearsWorked: 3,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports sorting", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?sort=-yearsWorked",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
              },
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports pagination", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?page[size]=1&page[number]=1",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        it("supports include", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users?include=todos",
          )

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: { version: "1.0" },
            data: [
              {
                type: "User",
                id: "1",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                },
                relationships: { todos: { data: [{ type: "Todo", id: "1" }] } },
              },
              {
                type: "User",
                id: "2",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                },
                relationships: { todos: { data: [] } },
              },
            ],
            included: [
              {
                type: "Todo",
                id: "1",
                attributes: {
                  name: "Test",
                  userId: 1,
                },
              },
            ],
            meta: { unpaginatedCount: 2 },
          })
        })
      })
    })
  })
})

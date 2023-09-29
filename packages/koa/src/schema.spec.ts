import {
  belongsTo,
  boolean,
  dateonly,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
  text,
  uuid,
} from "@hatchifyjs/core"
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
          name: {
            type: "STRING",
            validate: { len: [1, 10] },
            defaultValue: "test",
          },
          age: { type: "INTEGER", validate: { min: 0 }, defaultValue: 1 },
          yearsWorked: {
            type: "INTEGER",
            validate: { min: 0 },
            defaultValue: 2,
          },
          hireDate: {
            type: "DATE",
            validate: { isAfter: "2022-12-31T00:00:00.000Z" },
            defaultValue: "2022-12-31T00:00:00.000Z",
          },
          bio: { type: "TEXT", defaultValue: "test" },
          status: {
            type: "ENUM",
            values: ["active", "inactive"],
            defaultValue: "active",
          },
          isDeleted: { type: "BOOLEAN", defaultValue: false },
          birthday: { type: "DATEONLY", defaultValue: "1970-01-01" },
          uuid: {
            type: "UUID",
            defaultValue: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
          },
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
            default: "1",
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "bio",
            allowNull: true,
            default: dialect === "postgres" ? "'test'::text" : "'test'",
            primary: false,
            type: dialect === "postgres" ? "text" : "TEXT",
          },
          {
            name: "birthday",
            allowNull: true,
            default:
              dialect === "postgres" ? "'1970-01-01'::date" : "'1970-01-01'",
            primary: false,
            type: dialect === "postgres" ? "date" : "DATE",
          },
          {
            name: "hire_date",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'2022-12-31 00:00:00+00'::timestamp with time zone"
                : "'2022-12-31 00:00:00.000 +00:00'",
            primary: false,
            type:
              dialect === "postgres" ? "timestamp with time zone" : "DATETIME",
          },
          {
            name: "id",
            allowNull: dialect === "sqlite",
            default:
              dialect === "postgres"
                ? "nextval('user_id_seq'::regclass)"
                : null,
            primary: true,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "is_deleted",
            allowNull: true,
            default: dialect === "postgres" ? "false" : "0",
            primary: false,
            type: dialect === "postgres" ? "boolean" : "TINYINT(1)",
          },
          {
            name: "name",
            allowNull: true,
            default:
              dialect === "postgres" ? "'test'::character varying" : "'test'",
            primary: false,
            type: dialect === "postgres" ? "character varying" : "VARCHAR(255)",
          },
          {
            name: "status",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'active'::enum_user_status"
                : "'active'",
            primary: false,
            type: dialect === "postgres" ? "USER-DEFINED" : "TEXT",
          },
          {
            name: "uuid",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'6ca2929f-c66d-4542-96a9-f1a6aa3d2678'::uuid"
                : "'6ca2929f-c66d-4542-96a9-f1a6aa3d2678'",
            primary: false,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "years_worked",
            allowNull: true,
            default: "2",
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
                    birthday: "1970-01-01",
                    uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                    birthday: "1970-01-01",
                    uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
              id: postUser1.data.id,
              type: "User",
              attributes: {
                name: "John Doe",
                age: 21,
                yearsWorked: 1,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: true,
                birthday: "1970-01-01",
                uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              },
            },
          })

          expect(postStatus2).toBe(200)
          expect(postUser2).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: postUser2.data.id,
              type: "User",
              attributes: {
                name: "Jane Doe",
                age: 22,
                yearsWorked: 3,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: false,
                birthday: "1970-01-01",
                uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                    birthday: "invalid",
                    uuid: "invalid",
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
                      bio: "test",
                      status: "invalid",
                      isDeleted: "invalid",
                      birthday: "Invalid date",
                      uuid: "invalid",
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
                      bio: "test",
                      status: "invalid",
                      isDeleted: "invalid",
                      birthday: "Invalid date",
                      uuid: "invalid",
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
                      bio: "test",
                      status: "invalid",
                      isDeleted: "invalid",
                      birthday: "Invalid date",
                      uuid: "invalid",
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
                      bio: "test",
                      status: "invalid",
                      isDeleted: "invalid",
                      birthday: "Invalid date",
                      uuid: "invalid",
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
                      bio: "test",
                      status: "invalid",
                      isDeleted: "invalid",
                      birthday: "Invalid date",
                      uuid: "invalid",
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
              },
              {
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  yearsWorked: 1,
                },
              },
              {
                id: postUser2.data.id,
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
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
              },
              {
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
                relationships: {
                  todos: { data: [{ type: "Todo", id: todoId }] },
                },
              },
              {
                type: "User",
                id: postUser2.data.id,
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
                relationships: { todos: { data: [] } },
              },
            ],
            included: [
              {
                type: "Todo",
                id: todoId,
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
          name: string({ min: 1, max: 10, default: "test" }),
          age: integer({ min: 0, default: 1 }),
          yearsWorked: integer({ min: 0, default: 2 }),
          hireDate: datetime({
            min: new Date("2022-12-31T00:00:00.000Z"),
            default: new Date("2022-12-31T00:00:00.000Z"),
          }),
          bio: text({ default: "test" }),
          status: enumerate({
            values: ["active", "inactive"],
            default: "active",
          }),
          isDeleted: boolean({ default: false }),
          birthday: dateonly({ default: '"1970-01-01"' }),
          uuid: uuid({ default: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678" }),
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
            default: "1",
            primary: false,
            type: dialect === "postgres" ? "integer" : "INTEGER",
          },
          {
            name: "bio",
            allowNull: true,
            default: dialect === "postgres" ? "'test'::text" : "'test'",
            primary: false,
            type: dialect === "postgres" ? "text" : "TEXT",
          },
          {
            name: "birthday",
            allowNull: true,
            default:
              dialect === "postgres" ? "'1970-01-01'::date" : "'1970-01-01'",
            primary: false,
            type: dialect === "postgres" ? "date" : "DATE",
          },
          {
            name: "hire_date",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'2022-12-31 00:00:00+00'::timestamp with time zone"
                : "'2022-12-31 00:00:00.000 +00:00'",
            primary: false,
            type:
              dialect === "postgres" ? "timestamp with time zone" : "DATETIME",
          },
          {
            name: "id",
            allowNull: false,
            default: null,
            primary: true,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "is_deleted",
            allowNull: true,
            default: dialect === "postgres" ? "false" : "0",
            primary: false,
            type: dialect === "postgres" ? "boolean" : "TINYINT(1)",
          },
          {
            name: "name",
            allowNull: true,
            default:
              dialect === "postgres" ? "'test'::character varying" : "'test'",
            primary: false,
            type: dialect === "postgres" ? "character varying" : "VARCHAR(10)",
          },
          {
            name: "status",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'active'::enum_user_status"
                : "'active'",
            primary: false,
            type: dialect === "postgres" ? "USER-DEFINED" : "TEXT",
          },
          {
            name: "uuid",
            allowNull: true,
            default:
              dialect === "postgres"
                ? "'6ca2929f-c66d-4542-96a9-f1a6aa3d2678'::uuid"
                : "'6ca2929f-c66d-4542-96a9-f1a6aa3d2678'",
            primary: false,
            type: dialect === "postgres" ? "uuid" : "UUID",
          },
          {
            name: "years_worked",
            allowNull: true,
            default: "2",
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
                    birthday: "1970-01-01",
                    uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                    birthday: "1970-01-01",
                    uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
              id: expect.any(String),
              type: "User",
              attributes: {
                name: "John Doe",
                age: 21,
                yearsWorked: 1,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: true,
                birthday: "1970-01-01",
                uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              },
            },
          })

          expect(postStatus2).toBe(200)
          expect(postUser2).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: {
              id: expect.any(String),
              type: "User",
              attributes: {
                name: "Jane Doe",
                age: 22,
                yearsWorked: 3,
                hireDate: "2023-01-01T00:00:00.000Z",
                bio: "bla bla",
                status: "active",
                isDeleted: false,
                birthday: "1970-01-01",
                uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                    birthday: "invalid",
                    uuid: "invalid",
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
              {
                status: 422,
                code: "unexpected-value",
                detail:
                  "Payload must have 'birthday' as an ISO 8601 date string but received 'Invalid date' instead.",
                source: { pointer: "/data/attributes/birthday" },
                title: "Unexpected value.",
              },
              {
                status: 422,
                code: "unexpected-value",
                detail:
                  "Payload must have 'uuid' with length greater than or equal to 36 but received 'invalid' instead.",
                source: { pointer: "/data/attributes/uuid" },
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
              },
              {
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  yearsWorked: 1,
                },
              },
              {
                id: postUser2.data.id,
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
                id: postUser2.data.id,
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
              },
              {
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
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
                id: postUser1.data.id,
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
                relationships: {
                  todos: { data: [{ type: "Todo", id: todoId }] },
                },
              },
              {
                type: "User",
                id: postUser2.data.id,
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
                  hireDate: "2023-01-01T00:00:00.000Z",
                  bio: "bla bla",
                  status: "active",
                  isDeleted: false,
                  birthday: "1970-01-01",
                  uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                },
                relationships: { todos: { data: [] } },
              },
            ],
            included: [
              {
                type: "Todo",
                id: todoId,
                attributes: {
                  name: "Test",
                  userId: postUser1.data.id,
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

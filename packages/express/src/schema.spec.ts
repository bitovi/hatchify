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
import type { PartialSchema } from "@hatchifyjs/node"

import {
  dbDialects,
  getDatabaseColumns,
  startServerWith,
} from "./testing/utils.js"

describe.each(dbDialects)("schema", (dialect) => {
  describe(`${dialect}`, () => {
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
                    bio: "john was ...",
                    status: "active",
                    isDeleted: true,
                    birthday: "1970-01-02",
                    uuid: "dc287b2a-8c26-4687-9826-4bdcb7e260a9",
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
                    bio: "jane was ...",
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
                bio: "john was ...",
                status: "active",
                isDeleted: true,
                birthday: "1970-01-02",
                uuid: "dc287b2a-8c26-4687-9826-4bdcb7e260a9",
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
                bio: "jane was ...",
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
          const { status: getStatus, body: getUsers } =
            await fetch("/api/users")

          expect(getStatus).toBe(200)
          expect(getUsers).toEqual({
            jsonapi: {
              version: "1.0",
            },
            data: [postUser1.data, postUser2.data],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })

        describe("supports filtering users", () => {
          describe("by integer", () => {
            it("no operator", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age]=22",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$eq", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$eq]=22",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$gt]=21",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$gte]=21",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data, postUser2.data],
                meta: {
                  unpaginatedCount: 2,
                },
              })
            })

            it("$in", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$in]=20&filter[age][$in]=21",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$lt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$lt]=22",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$lte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$lte]=22",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data, postUser2.data],
                meta: {
                  unpaginatedCount: 2,
                },
              })
            })

            it("$ne", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$ne]=21",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$nin", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[age][$nin]=20&filter[age][$nin]=21",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })
          })

          describe("by text", () => {
            it("no operator", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio]=${encodeURIComponent("jane was ...")}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$eq", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$eq]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$gt]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$gte]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data, postUser2.data],
                meta: {
                  unpaginatedCount: 2,
                },
              })
            })

            it("$in", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$in]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$lt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$lt]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [],
                meta: {
                  unpaginatedCount: 0,
                },
              })
            })

            it("$lte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$lte]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$ne", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$ne]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$nin", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$nin]=${encodeURIComponent(
                  "jane was ...",
                )}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$like", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$like]=${encodeURIComponent("jane%")}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$ilike", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                `/api/users?filter[bio][$ilike]=${encodeURIComponent("Jane%")}`,
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })
          })

          describe("by boolean", () => {
            it("no operator", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[isDeleted]=false",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$eq", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[isDeleted][$eq]=false",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$in", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[isDeleted][$in]=false",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$ne", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[isDeleted][$ne]=false",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$nin", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[isDeleted][$nin]=false",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })
          })

          describe("by dateonly", () => {
            it("no operator", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$eq", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$eq]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$gt]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$gte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$gte]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data, postUser2.data],
                meta: {
                  unpaginatedCount: 2,
                },
              })
            })

            it("$in", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$in]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$lt", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$lt]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [],
                meta: {
                  unpaginatedCount: 0,
                },
              })
            })

            it("$lte", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$lte]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$ne", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$ne]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$nin", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[birthday][$nin]=1970-01-01",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })
          })

          describe("by uuid", () => {
            it("no operator", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[uuid]=6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$eq", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[uuid][$eq]=6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$in", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[uuid][$in]=6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser2.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$ne", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[uuid][$ne]=6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })

            it("$nin", async () => {
              const { status: getStatus, body: getUsers } = await fetch(
                "/api/users?filter[uuid][$nin]=6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
              )

              expect(getStatus).toBe(200)
              expect(getUsers).toEqual({
                jsonapi: {
                  version: "1.0",
                },
                data: [postUser1.data],
                meta: {
                  unpaginatedCount: 1,
                },
              })
            })
          })
        })

        describe("supports fields", () => {
          it("integer", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?fields[User]=age",
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
                    age: 21,
                  },
                },
                {
                  id: postUser2.data.id,
                  type: "User",
                  attributes: {
                    age: 22,
                  },
                },
              ],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("text", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?fields[User]=bio",
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
                    bio: "john was ...",
                  },
                },
                {
                  id: postUser2.data.id,
                  type: "User",
                  attributes: {
                    bio: "jane was ...",
                  },
                },
              ],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("boolean", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?fields[User]=isDeleted",
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
                    isDeleted: true,
                  },
                },
                {
                  id: postUser2.data.id,
                  type: "User",
                  attributes: {
                    isDeleted: false,
                  },
                },
              ],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("dateonly", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?fields[User]=birthday",
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
                    birthday: "1970-01-02",
                  },
                },
                {
                  id: postUser2.data.id,
                  type: "User",
                  attributes: {
                    birthday: "1970-01-01",
                  },
                },
              ],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("uuid", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?fields[User]=uuid",
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
                    uuid: "dc287b2a-8c26-4687-9826-4bdcb7e260a9",
                  },
                },
                {
                  id: postUser2.data.id,
                  type: "User",
                  attributes: {
                    uuid: "6ca2929f-c66d-4542-96a9-f1a6aa3d2678",
                  },
                },
              ],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })
        })

        describe("supports sorting", () => {
          it("integer", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?sort=-age",
            )

            expect(getStatus).toBe(200)
            expect(getUsers).toEqual({
              jsonapi: {
                version: "1.0",
              },
              data: [postUser2.data, postUser1.data],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("text", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?sort=birthday",
            )

            expect(getStatus).toBe(200)
            expect(getUsers).toEqual({
              jsonapi: {
                version: "1.0",
              },
              data: [postUser2.data, postUser1.data],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("boolean", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?sort=isDeleted",
            )

            expect(getStatus).toBe(200)
            expect(getUsers).toEqual({
              jsonapi: {
                version: "1.0",
              },
              data: [postUser2.data, postUser1.data],
              meta: {
                unpaginatedCount: 2,
              },
            })
          })

          it("dateonly", async () => {
            const { status: getStatus, body: getUsers } = await fetch(
              "/api/users?sort=birthday",
            )

            expect(getStatus).toBe(200)
            expect(getUsers).toEqual({
              jsonapi: {
                version: "1.0",
              },
              data: [postUser2.data, postUser1.data],
              meta: {
                unpaginatedCount: 2,
              },
            })
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
            data: [postUser1.data],
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
                  bio: "john was ...",
                  status: "active",
                  isDeleted: true,
                  birthday: "1970-01-02",
                  uuid: "dc287b2a-8c26-4687-9826-4bdcb7e260a9",
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
                  bio: "jane was ...",
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

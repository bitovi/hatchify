import { integer, string } from "@hatchifyjs/hatchify-core"
import type { HatchifyModel, PartialSchema } from "@hatchifyjs/node"

import { dbDialects, startServerWith } from "./testing/utils"

describe.each(dbDialects)("Operators", (dialect) => {
  describe(`${dialect} - schema`, () => {
    describe(`${dialect} - v1`, () => {
      const User: HatchifyModel = {
        name: "User",
        attributes: {
          name: { type: "STRING", validate: { len: [1, 10] } },
          age: { type: "INTEGER", validate: { min: 0 } },
          yearsWorked: { type: "INTEGER", validate: { min: 0 } },
        },
      }

      let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
      let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
      let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

      beforeAll(async () => {
        ;({ fetch, hatchify, teardown } = await startServerWith([User], dialect))
      })

      afterAll(async () => {
        await teardown()
      })

      it("should create a snake_case table with id, name, age and years_worked columns", async () => {
        const [columns] = await hatchify._sequelize.query(
          'SELECT * FROM pragma_table_info("user")',
        )

        expect(columns).toHaveLength(4)
        expect(columns[0]).toMatchObject({
          name: "id",
          notnull: 0,
          pk: 1,
          type: "INTEGER",
        })
        expect(columns[1]).toMatchObject({
          name: "name",
          notnull: 0,
          pk: 0,
          type: "VARCHAR(255)",
        })
        expect(columns[2]).toMatchObject({
          name: "age",
          notnull: 0,
          pk: 0,
          type: "INTEGER",
        })
        expect(columns[3]).toMatchObject({
          name: "years_worked",
          notnull: 0,
          pk: 0,
          type: "INTEGER",
        })
      })

      describe("should have API with core features working", () => {
        let postStatus1: number
        let postUser1: any
        let postStatus2: number
        let postUser2: any

        beforeAll(async () => {
          ;[
            { status: postStatus1, body: postUser1 },
            { status: postStatus2, body: postUser2 },
          ] = await Promise.all([
            fetch("/api/users", {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "John Doe",
                    age: 21,
                    yearsWorked: 1,
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
                    name: "Jane Doe",
                    age: 22,
                    yearsWorked: 3,
                  },
                },
              },
            }),
          ])
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
              },
            },
          })
        })

        it("validates name, age and yearsWorked", async () => {
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
                    instance: { id: null, name: "", age: -1, yearsWorked: -1 },
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
                    instance: { id: null, name: "", age: -1, yearsWorked: -1 },
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
                    instance: { id: null, name: "", age: -1, yearsWorked: -1 },
                    validatorKey: "min",
                    validatorName: "min",
                    validatorArgs: [0],
                    original: { validatorName: "min", validatorArgs: [0] },
                  },
                ],
              },
            ],
          })
        })

        it("supports listing all users", async () => {
          const { status: getStatus, body: getUsers } = await fetch("/api/users")

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
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
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
                },
              },
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
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
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })
      })
    })

    describe(`${dialect} - v2`, () => {
      const User: PartialSchema = {
        name: "User",
        attributes: {
          name: string({ min: 1, max: 10 }),
          age: integer({ min: 0 }),
          yearsWorked: integer({ min: 0 }),
        },
      }

      let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
      let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
      let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

      beforeAll(async () => {
        ;({ fetch, hatchify, teardown } = await startServerWith({ User }))
      })

      afterAll(async () => {
        await teardown()
      })

      it("should create a snake_case table with id, age and years_worked columns", async () => {
        const [columns] = await hatchify._sequelize.query(
          'SELECT * FROM pragma_table_info("user")',
        )

        expect(columns).toHaveLength(4)
        expect(columns[0]).toMatchObject({
          name: "id",
          notnull: 0,
          pk: 1,
          type: "INTEGER",
        })
        expect(columns[1]).toMatchObject({
          name: "name",
          notnull: 0,
          pk: 0,
          type: "VARCHAR(10)",
        })
        expect(columns[2]).toMatchObject({
          name: "age",
          notnull: 0,
          pk: 0,
          type: "INTEGER",
        })
        expect(columns[3]).toMatchObject({
          name: "years_worked",
          notnull: 0,
          pk: 0,
          type: "INTEGER",
        })
      })

      describe("should have API with core features working", () => {
        let postStatus1: number
        let postUser1: any
        let postStatus2: number
        let postUser2: any

        beforeAll(async () => {
          ;[
            { status: postStatus1, body: postUser1 },
            { status: postStatus2, body: postUser2 },
          ] = await Promise.all([
            fetch("/api/users", {
              method: "post",
              body: {
                data: {
                  type: "User",
                  attributes: {
                    name: "John Doe",
                    age: 21,
                    yearsWorked: 1,
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
                    name: "Jane Doe",
                    age: 22,
                    yearsWorked: 3,
                  },
                },
              },
            }),
          ])
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
              },
            },
          })
        })

        it("validates name, age and yearsWorked", async () => {
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
            ],
          })
        })

        it("supports listing all users", async () => {
          const { status: getStatus, body: getUsers } = await fetch(
            "/api/users"
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
                },
              },
              {
                id: "2",
                type: "User",
                attributes: {
                  name: "Jane Doe",
                  age: 22,
                  yearsWorked: 3,
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
                },
              },
              {
                id: "1",
                type: "User",
                attributes: {
                  name: "John Doe",
                  age: 21,
                  yearsWorked: 1,
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
                },
              },
            ],
            meta: {
              unpaginatedCount: 2,
            },
          })
        })
      })
    })
  })
})

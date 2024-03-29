import {
  belongsTo,
  datetime,
  enumerate,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"

import { dbDialects, startServerWith } from "./testing/utils.js"

describe.each(dbDialects)("Error Code Tests", (dialect) => {
  describe(`${dialect}`, () => {
    const User = {
      name: "User",
      attributes: {
        name: string(),
        role: enumerate({ values: ["user", "admin"] }),
      },
      relationships: {
        todos: hasMany(),
      },
    } satisfies PartialSchema
    const Todo = {
      name: "Todo",
      attributes: {
        name: string({ required: true }),
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

    it("should return error VALUE_REQUIRED error code when required field is not passed (HATCH-124)", async () => {
      const ERROR_CODE_VALUE_REQUIRED = {
        status: 422,
        code: "value-required",
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'name'.",
        source: {
          pointer: "/data/attributes/name",
        },
      }
      const response = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "Todo",
            attributes: {
              dueDate: "2024-12-12",
              importance: 6,
            },
          },
        },
      })

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_VALUE_REQUIRED],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when receiving wrong type for relationship data (HATCH-172)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail: "Payload must have 'data' as an object.",
        source: {
          pointer: "/data/relationships/user/data",
        },
      }
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
      const { status, body } = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "Todo",
            attributes: {
              name: "Something B for user 1",
              dueDate: "2024-12-12",
              importance: 7,
            },
            relationships: {
              user: { data: [{ type: "User", id: user.data.id }] },
            },
          },
        },
      })

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when enum is violated (HATCH-199)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail:
          "Payload must have 'role' as one of 'user', 'admin' but received 'invalid' instead.",
        source: {
          pointer: "/data/attributes/role",
        },
      }
      const response = await fetch("/api/users", {
        method: "post",
        body: {
          data: {
            type: "User",
            attributes: {
              name: "John Doe",
              role: "invalid",
            },
          },
        },
      })

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    it("should return error VALUE_REQUIRED error code when invalid data schema is passed (HATCH-206)", async () => {
      const ERROR_CODE_VALUE_REQUIRED = {
        status: 422,
        code: "value-required",
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'data'.",
        source: {
          pointer: "/data",
        },
      }
      const response = await fetch("/api/todos", {
        method: "post",
        body: {
          dat: {
            type: "Todo",
            attributes: {
              id: "101",
              name: "Walk the dog",
              dueDate: "2024-12-12",
              importance: 6,
            },
          },
        },
      })

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_VALUE_REQUIRED],
      })
    })

    it("should return error VALUE_REQUIRED error code when type is missing (HATCH-208)", async () => {
      const ERROR_CODE_VALUE_REQUIRED = {
        status: 422,
        code: "value-required",
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'type'.",
        source: {
          pointer: "/data/type",
        },
      }
      const response = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            attributes: {
              id: "101",
              name: "Walk the dog",
              dueDate: "2024-12-12",
              importance: 6,
            },
          },
        },
      })

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_VALUE_REQUIRED],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when type is wrong (HATCH-210)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail: "Payload must have 'type' as 'Todo'.",
        source: {
          pointer: "/data/type",
        },
      }
      const response = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "todo",
            attributes: {
              id: "101",
              name: "Walk the dog",
              dueDate: "2024-12-12",
              importance: 6,
            },
          },
        },
      })

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when receiving non-object for attributes (HATCH-210)", () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail: "Payload must have 'attributes' as an object.",
        source: {
          pointer: "/data/attributes",
        },
      }

      it("handles attributes of string", async () => {
        const { status, body } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: {
              type: "Todo",
              attributes: "I am trouble",
            },
          },
        })

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("handles attributes of array", async () => {
        const { status, body } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: {
              type: "Todo",
              attributes: [],
            },
          },
        })

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("handles attributes of null", async () => {
        const { status, body } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: {
              type: "Todo",
              attributes: null,
            },
          },
        })

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })
    })

    it("should return error NOT_FOUND error code when trying to update a non-existing todo (HATCH-211)", async () => {
      const ERROR_CODE_NOT_FOUND = {
        status: 404,
        code: "not-found",
        title: "Resource not found.",
        detail: "URL must include an ID of an existing 'Todo'.",
        source: {
          parameter: "id",
        },
      }

      const response = await fetch(
        "/api/todos/00000000-0000-0000-0000-000000000000",
        {
          method: "patch",
          body: {
            data: {
              type: "Todo",
              attributes: {
                name: "Updated",
              },
            },
          },
        },
      )

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_NOT_FOUND.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_NOT_FOUND],
      })
    })

    it("should return error NOT_FOUND error code when trying to delete a non-existing todo (HATCH-212)", async () => {
      const ERROR_CODE_NOT_FOUND = {
        status: 404,
        code: "not-found",
        title: "Resource not found.",
        detail: "URL must include an ID of an existing 'Todo'.",
        source: {
          parameter: "id",
        },
      }
      const response = await fetch(
        "/api/todos/00000000-0000-0000-0000-000000000000",
        {
          method: "delete",
        },
      )

      expect(response).toBeTruthy()

      const { status, body } = response

      expect(status).toBe(ERROR_CODE_NOT_FOUND.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_NOT_FOUND],
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when receiving zeros for pagination (HATCH-213)", () => {
      it("valid page number and valid page size", async () => {
        const { status } = await fetch("/api/todos?page[number]=1&page[size]=1")

        expect(status).toBe(200)
      })

      it("valid page number and missing page size", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page number was provided but page size was not provided.",
          source: {
            parameter: "page[size]",
          },
        }
        const { status, body } = await fetch("/api/todos?page[number]=1")

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("valid page number and page size of zero", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page size should be a positive integer.",
          source: {
            parameter: "page[size]",
          },
        }
        const { status, body } = await fetch(
          "/api/todos?page[number]=1&page[size]=0",
        )

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("missing page number and valid page size", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page size was provided but page number was not provided.",
          source: {
            parameter: "page[number]",
          },
        }
        const { status, body } = await fetch("/api/todos?page[size]=1")

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("missing page number and missing page size", async () => {
        const { status } = await fetch("/api/todos")

        expect(status).toBe(200)
      })

      it("missing page number and page size of zero", async () => {
        const { status, body } = await fetch("/api/todos?page[size]=0")

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail:
                "Page size was provided but page number was not provided.",
              source: {
                parameter: "page[number]",
              },
            },
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page size should be a positive integer.",
              source: {
                parameter: "page[size]",
              },
            },
          ],
        })
      })

      it("page number of zero and valid page size", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page number should be a positive integer.",
          source: {
            parameter: "page[number]",
          },
        }
        const { status, body } = await fetch(
          "/api/todos?page[number]=0&page[size]=1",
        )

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("page number of zero and missing page size", async () => {
        const { status, body } = await fetch("/api/todos?page[number]=0")

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page number should be a positive integer.",
              source: {
                parameter: "page[number]",
              },
            },
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail:
                "Page number was provided but page size was not provided.",
              source: {
                parameter: "page[size]",
              },
            },
          ],
        })
      })

      it("page number of zero and page size of zero", async () => {
        const { status, body } = await fetch(
          "/api/todos?page[number]=0&page[size]=0",
        )

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page number should be a positive integer.",
              source: { parameter: "page[number]" },
            },
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page size should be a positive integer.",
              source: { parameter: "page[size]" },
            },
          ],
        })
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when receiving unsupported page values (HATCH-331)", () => {
      it("multiple unsupported page values", async () => {
        const { status, body } = await fetch("/api/todos?page[x]=1&page[y]=2")

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page x is not supported.",
              source: {
                parameter: "page[x]",
              },
            },
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page y is not supported.",
              source: {
                parameter: "page[y]",
              },
            },
          ],
        })
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when receiving zeros for pagination (HATCH-332)", () => {
      it("valid page offset and valid page limit", async () => {
        const { status } = await fetch(
          "/api/todos?page[offset]=1&page[limit]=1",
        )

        expect(status).toBe(200)
      })

      it("valid page offset and missing page limit", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page offset was provided but page limit was not provided.",
          source: {
            parameter: "page[limit]",
          },
        }
        const { status, body } = await fetch("/api/todos?page[offset]=1")

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("valid page offset and page limit of zero", async () => {
        const ERROR_CODE_UNEXPECTED_VALUE = {
          status: 422,
          code: "unexpected-value",
          title: "Unexpected value.",
          detail: "Page limit should be a positive integer.",
          source: {
            parameter: "page[limit]",
          },
        }
        const { status, body } = await fetch(
          "/api/todos?page[offset]=1&page[limit]=0",
        )

        expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_UNEXPECTED_VALUE],
        })
      })

      it("missing page offset and missing page limit", async () => {
        const { status } = await fetch("/api/todos")

        expect(status).toBe(200)
      })

      it("missing page offset and page limit of zero", async () => {
        const { status, body } = await fetch("/api/todos?page[limit]=0")

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page limit should be a positive integer.",
              source: {
                parameter: "page[limit]",
              },
            },
          ],
        })
      })

      it("page offset of zero and missing page limit", async () => {
        const { status, body } = await fetch("/api/todos?page[offset]=0")

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail:
                "Page offset was provided but page limit was not provided.",
              source: {
                parameter: "page[limit]",
              },
            },
          ],
        })
      })

      it("page offset of zero and page limit of zero", async () => {
        const { status, body } = await fetch(
          "/api/todos?page[offset]=0&page[limit]=0",
        )

        expect(status).toBe(422)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [
            {
              status: 422,
              code: "unexpected-value",
              title: "Unexpected value.",
              detail: "Page limit should be a positive integer.",
              source: { parameter: "page[limit]" },
            },
          ],
        })
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when receiving data for non-existing relationships (HATCH-214)", () => {
      it("POST", async () => {
        const ERROR_CODE_RELATIONSHIP_PATH = {
          status: 400,
          code: "relationship-path",
          title: "Relationship path could not be identified.",
          detail: "Payload must include an identifiable relationship path.",
          source: {
            pointer: "/data/relationships/usrError",
          },
        }

        const { status, body } = await fetch("/api/todos", {
          method: "post",
          body: {
            data: {
              type: "Todo",
              attributes: {
                name: "A todo for user 1",
                dueDate: "2024-12-12",
                importance: 8,
              },
              relationships: {
                usrError: {
                  data: {
                    type: "User",
                    id: "435d86ab-ff9f-4599-a805-a978f49710b1",
                  },
                },
              },
            },
          },
        })

        expect(status).toBe(ERROR_CODE_RELATIONSHIP_PATH.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_RELATIONSHIP_PATH],
        })
      })

      it("PATCH", async () => {
        const ERROR_CODE_RELATIONSHIP_PATH = {
          status: 400,
          code: "relationship-path",
          title: "Relationship path could not be identified.",
          detail: "Payload must include an identifiable relationship path.",
          source: {
            pointer: "/data/relationships/usrError",
          },
        }

        const { status, body } = await fetch(
          "/api/todos/cbfb99bc-f55d-4b9a-8abf-381dd0c8c709",
          {
            method: "patch",
            body: {
              data: {
                type: "Todo",
                attributes: {
                  name: "A todo for user 1",
                  dueDate: "2024-12-12",
                  importance: 8,
                },
                relationships: {
                  usrError: {
                    data: {
                      type: "User",
                      id: "435d86ab-ff9f-4599-a805-a978f49710b1",
                    },
                  },
                },
              },
            },
          },
        )

        expect(status).toBe(ERROR_CODE_RELATIONSHIP_PATH.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_RELATIONSHIP_PATH],
        })
      })
    })

    it("should return error VALUE_REQUIRED error code when receiving no data for relationships (HATCH-215)", async () => {
      const ERROR_CODE_VALUE_REQUIRED = {
        status: 422,
        code: "value-required",
        title: "Payload is missing a required value.",
        detail: "Payload must include a value for 'data'.",
        source: {
          pointer: "/data/relationships/user/data",
        },
      }
      const { status, body } = await fetch("/api/todos", {
        method: "post",
        body: {
          data: {
            type: "Todo",
            attributes: {
              name: "A todo for user 1",
              dueDate: "2024-12-12",
              importance: 8,
            },
            relationships: {
              user: {
                dat: { type: "User", id: "1" },
              },
            },
          },
        },
      })

      expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_VALUE_REQUIRED],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when receiving non existing fields for sort (HATCH-222)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail:
          "URL must have 'sort' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'userId'.",
        source: {
          parameter: "sort",
        },
      }
      const { status, body } = await fetch("/api/todos?sort=namee")

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when receiving non existing fields for filter (HATCH-223)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail:
          "URL must have 'filter[x]' where 'x' is one of 'name', 'dueDate', 'importance', 'userId'.",
        source: {
          parameter: "filter[namee]",
        },
      }
      const { status, body } = await fetch(
        "/api/todos?filter[namee][]=John+Doe",
      )

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when receiving non-existing filter (HATCH-243)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail:
          "URL must have 'fields[Todo]' as comma separated values containing one or more of 'name', 'dueDate', 'importance', 'userId'.",
        source: {
          parameter: "fields[Todo]",
        },
      }
      const { status, body } = await fetch("/api/todos?fields[Todo]=nam")

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    it("should return error UNEXPECTED_VALUE error code when receiving non-existing schema (HATCH-244)", async () => {
      const ERROR_CODE_UNEXPECTED_VALUE = {
        status: 422,
        code: "unexpected-value",
        title: "Unexpected value.",
        detail: "URL must have 'fields[x]' where 'x' is one of 'Todo', 'User'.",
        source: {
          parameter: "fields[]",
        },
      }
      const { status, body } = await fetch("/api/todos?fields[]=name")

      expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
      expect(body).toEqual({
        jsonapi: { version: "1.0" },
        errors: [ERROR_CODE_UNEXPECTED_VALUE],
      })
    })

    describe("should return error UNEXPECTED_VALUE error code when 'type' property is misspelled (HATCH-207)", () => {
      it("POST", async () => {
        const ERROR_CODE_VALUE_REQUIRED = {
          status: 422,
          code: "value-required",
          title: "Payload is missing a required value.",
          detail: "Payload must include a value for 'type'.",
          source: {
            pointer: "/data/type",
          },
        }
        const response = await fetch("/api/todos", {
          method: "post",
          body: {
            data: {
              typed: "Todo",
              attributes: {
                id: "101",
                name: "Walk the dog",
                dueDate: "2024-12-12",
                importance: 6,
                complete: true,
              },
            },
          },
        })

        expect(response).toBeTruthy()

        const { status, body } = response

        expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_VALUE_REQUIRED],
        })
      })

      it("PATCH", async () => {
        const ERROR_CODE_VALUE_REQUIRED = {
          status: 422,
          code: "value-required",
          title: "Payload is missing a required value.",
          detail: "Payload must include a value for 'type'.",
          source: {
            pointer: "/data/type",
          },
        }
        const response = await fetch(
          "/api/todos/cbfb99bc-f55d-4b9a-8abf-381dd0c8c709",
          {
            method: "patch",
            body: {
              data: {
                typed: "Todo",
                attributes: {
                  id: "101",
                  name: "Walk the dog",
                  dueDate: "2024-12-12",
                  importance: 6,
                  complete: true,
                },
              },
            },
          },
        )

        expect(response).toBeTruthy()

        const { status, body } = response

        expect(status).toBe(ERROR_CODE_VALUE_REQUIRED.status)
        expect(body).toEqual({
          jsonapi: { version: "1.0" },
          errors: [ERROR_CODE_VALUE_REQUIRED],
        })
      })
    })
  })
})

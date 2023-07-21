import type { HatchifyModel } from "@hatchifyjs/node"

import { startServerWith } from "./utils"

describe("Error Code Tests", () => {
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
            due_date: "2024-12-12",
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

    const response = await fetch("/api/todos/-1", {
      method: "delete",
    })

    expect(response).toBeTruthy()

    const { status, body } = response

    expect(status).toBe(ERROR_CODE_NOT_FOUND.status)
    expect(body).toEqual({
      jsonapi: { version: "1.0" },
      errors: [ERROR_CODE_NOT_FOUND],
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

    const response = await fetch("/api/todos/-1", {
      method: "patch",
      body: { data: { attributes: { name: "Updated" } } },
    })

    expect(response).toBeTruthy()

    const { status, body } = response

    expect(status).toBe(ERROR_CODE_NOT_FOUND.status)
    expect(body).toEqual({
      jsonapi: { version: "1.0" },
      errors: [ERROR_CODE_NOT_FOUND],
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
          attributes: {
            name: "Something B for user 1",
            due_date: "2024-12-12",
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
            due_date: "2024-12-12",
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

  it("should return error UNEXPECTED_VALUE error code when type is wrong", async () => {
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
            due_date: "2024-12-12",
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

  it("should return error VALUE_REQUIRED error code when receiving no data for relationships (HATCH-215)", async () => {
    const ERROR_CODE_VALUE_REQUIRED = {
      status: 422,
      code: "value-required",
      title: "Payload is missing a required value.",
      detail: "Payload must include a value for 'data'.",
      source: {
        pointer: "/data/attributes/user/data",
      },
    }

    const { status, body } = await fetch("/api/todos", {
      method: "post",
      body: {
        data: {
          type: "Todo",
          attributes: {
            name: "A todo for user 1",
            due_date: "2024-12-12",
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

  it("should return error UNEXPECTED_VALUE error code when receiving non-existing filter (HATCH-243)", async () => {
    const ERROR_CODE_UNEXPECTED_VALUE = {
      status: 422,
      code: "unexpected-value",
      title: "Unexpected value.",
      detail:
        "URL must have 'fields[todo]' as comma separated values containing one or more of 'name', 'due_date', 'importance'.",
      source: {
        parameter: "fields[todo]",
      },
    }

    const { status, body } = await fetch("/api/todos?fields[todo]=nam")

    expect(status).toBe(ERROR_CODE_UNEXPECTED_VALUE.status)
    expect(body).toEqual({
      jsonapi: { version: "1.0" },
      errors: [ERROR_CODE_UNEXPECTED_VALUE],
    })
  })
})

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
})

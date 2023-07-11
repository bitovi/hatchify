import type { HatchifyModel } from "@hatchifyjs/node"

import { startServerWith } from "../testing/utils"

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

  it("should return error MISSING_DATA error code when invalid data schema is passed (HATCH-202)", async () => {
    const ERROR_CODE_MISSING_DATA = {
      status: 422,
      code: "missing-data",
      title: "'data' must be specified for this operation.",
      detail: "Payload was missing 'data' field. It can not be null/undefined.",
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

    expect(status).toBe(422)
    expect(body).toEqual({
      jsonapi: { version: "1.0" },
      errors: [ERROR_CODE_MISSING_DATA],
    })
  })
})

import type { HatchifyModel } from "@hatchifyjs/node"
import Koa from "koa"

import { Hatchify } from "../koa"
import { POST, createServer } from "../testing/utils"

const ERROR_CODE_MISSING_DATA = {
  status: 422,
  code: "missing-data",
  title: " 'data' must be specified for this operation. ",
  detail: "payload was missing 'data' field. It can not be null/undefined.",
  source: {
    pointer: "/data",
  },
}

describe("Error Code Tests", () => {
  const TodoModel: HatchifyModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      due_date: "DATE",
      importance: "INTEGER",
    },
  }
  it("should return error MISSING_DATA error code when invalid data schema is passed", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([TodoModel], {
      prefix: "/api",
      database: {
        dialect: "sqlite",
        storage: "example.sqlite",
      },
    })

    app.use(hatchify.middleware.allModels.all)
    const server = createServer(app)
    await hatchify.createDatabase()

    const create = await POST(
      server,
      "/api/todos",
      {
        invalid: {
          type: "Todo",
          attributes: {
            id: "101",
            name: "Walk the dog",
            due_date: "2024-12-12",
            importance: 6,
          },
        },
      },

      "application/vnd.api+json",
    )

    expect(create).toBeTruthy()
    expect(create.status).toBe(422)
    expect(create.deserialized).toContainEqual(ERROR_CODE_MISSING_DATA)
  })
})

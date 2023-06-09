import type { HatchifyModel } from "@hatchifyjs/node"
import Koa from "koa"

import { Hatchify } from "./koa"
import { GET, POST, createServer } from "./testing/utils"

describe("Relationships", () => {
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

  it("should always return type and id (HATCH-167)", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Todo, User], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    const { serialized: user } = await POST(server, "/api/users", {
      name: "John Doe",
      todos: [
        {
          name: "Walk the dog",
          due_date: "12-12-2024",
          importance: 0.6,
        },
      ],
    })

    expect(user).toEqual({
      jsonapi: {
        version: "1.0",
      },
      data: {
        id: "1",
        type: "User",
        attributes: {
          name: "John Doe",
        },
      },
    })

    const { serialized: todosNoFields } = await GET(
      server,
      "/api/todos?include=user",
    )

    expect(todosNoFields).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "12-12-2024",
            importance: 0.6,
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
    })

    const { serialized: todosWithFields } = await GET(
      server,
      "/api/todos?include=user&fields[Todo]=name,due_date&fields[User]=name",
    )

    expect(todosWithFields).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "12-12-2024",
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
    })

    const { serialized: todosWithIdField } = await GET(
      server,
      "/api/todos?include=user&fields[Todo]=id,name,due_date&fields[User]=name",
    )

    expect(todosWithIdField).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Todo",
          id: "1",
          attributes: {
            name: "Walk the dog",
            due_date: "12-12-2024",
          },
          relationships: { user: { data: { type: "User", id: "1" } } },
        },
      ],
      included: [{ type: "User", id: "1", attributes: { name: "John Doe" } }],
    })

    await hatchify.orm.close()
  })
})

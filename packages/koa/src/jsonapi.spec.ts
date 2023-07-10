import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import { Serializer } from "jsonapi-serializer"
import Koa from "koa"

import { Hatchify } from "./koa"
import { GET, POST, createServer } from "./testing/utils"

describe("JSON:API Tests", () => {
  const Model: HatchifyModel = {
    name: "Model",
    attributes: {
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  }

  const TodoModel = {
    name: "Todo",
    attributes: {
      name: "STRING",
      due_date: "DATE",
      importance: "INTEGER",
    },
  }

  function serialize(data) {
    const serializer = new Serializer("Model", {
      keyForAttribute: "snake_case",
      attributes: Object.keys(data),
    })
    const serial = serializer.serialize(data)
    return serial
  }

  it("should handle JSON:API create body", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Model], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    await POST(
      server,
      "/api/models",
      serialize({
        first_name: "firstName",
        last_name: "lastName",
      }),
      "application/vnd.api+json",
    )

    const create = await POST(
      server,
      "/api/models",
      serialize({
        first_name: "firstName2",
        last_name: "lastName2",
      }),
      "application/vnd.api+json",
    )

    await POST(
      server,
      "/api/models",
      serialize({
        first_name: "firstName3",
        last_name: "lastName3",
      }),
      "application/vnd.api+json",
    )

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.deserialized).toHaveProperty("id")
    expect(create.deserialized.id).toBeTruthy()

    const find = await GET(server, "/api/models/" + create.deserialized.id)

    expect(find).toBeTruthy()
    expect(find.status).toBe(200)
    expect(find.deserialized).toBeTruthy()
    expect(find.deserialized.id).toBe(create.deserialized.id)

    await hatchify.orm.close()
  })

  it("should return error 422 when invalid data schema is passed", async () => {
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
    expect(create.deserialized).toEqual({
      status: 422,
      code: "data-cannot-be-null",
      title: " 'data' cannot be null for this operation ",
      detail: "payload 'data' field can not be null",
      source: {
        pointer: "/data",
      },
    })
  })
})

import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import Express from "express"
import { Serializer } from "jsonapi-serializer"

import { Hatchify } from "./express"
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

  function serialize(data) {
    const serializer = new Serializer("Model", {
      keyForAttribute: "snake_case",
      attributes: Object.keys(data),
    })
    const serial = serializer.serialize(data)
    return serial
  }

  it("should handle JSON:API create body", async () => {
    const app = Express()
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
})

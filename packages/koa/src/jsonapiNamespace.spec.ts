import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import { Serializer } from "jsonapi-serializer"
import Koa from "koa"

import { Hatchify } from "./koa"
import { GET, POST, createServer } from "./testing/utils"

describe("JSON:API Tests", () => {
  const Model: HatchifyModel = {
    name: "Model",
    namespace: "TestSchema",
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
    const serializer = new Serializer("TestSchema.Model", {
      keyForAttribute: "snake_case",
      attributes: Object.keys(data),
      pluralizeType: false,
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

    //JK will separate cases into different it() tests
    const r1 = await POST(
      server,
      "/api/testschema.models",
      serialize({
        first_name: "firstName",
        last_name: "lastName",
        type: "TestSchema.Model",
      }),
      "application/vnd.api+json",
    )
    expect(r1).toBeTruthy()
    expect(r1.status).toBe(200)
    expect(r1.deserialized).toHaveProperty("id")
    expect(r1.deserialized.id).toBeTruthy()

    const r2 = await POST(
      server,
      "/api/testschema/models",
      serialize({
        first_name: "firstName2",
        last_name: "lastName2",
        type: "TestSchema.Model",
      }),
      "application/vnd.api+json",
    )

    expect(r2).toBeTruthy()
    expect(r2.status).toBe(200)
    expect(r2.deserialized).toHaveProperty("id")
    expect(r2.deserialized.id).toBeTruthy()

    const find = await GET(
      server,
      "/api/test-schema/models/" + r2.deserialized.id,
    )

    expect(find).toBeTruthy()
    expect(find.status).toBe(200)
    expect(find.deserialized).toBeTruthy()
    expect(find.deserialized.id).toBe(r2.deserialized.id)

    await hatchify.orm.close()
  })
})
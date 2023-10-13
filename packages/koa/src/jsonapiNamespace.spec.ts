import type { Server } from "http"

import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import dotenv from "dotenv"
import { Serializer } from "jsonapi-serializer"
import Koa from "koa"

import { Hatchify } from "./koa"
import { GET, POST, createServer } from "./testing/utils"

dotenv.config({ path: ".env" })

describe("JSON:API Tests", () => {
  let app: Koa
  let hatchify: Hatchify
  let server: Server
  const TestSchema_Model: PartialSchema = {
    name: "Model",
    namespace: "TestSchema",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }

  function serialize(data: any) {
    const serializer = new Serializer("TestSchema_Model", {
      keyForAttribute: "camelCase",
      attributes: Object.keys(data),
      pluralizeType: false,
    })
    const serial = serializer.serialize(data)
    return serial
  }

  beforeAll(async () => {
    app = new Koa()
    hatchify = new Hatchify(
      { TestSchema_Model },
      {
        prefix: "/api",
        database: {
          dialect: "postgres",
          host: process.env.PG_DB_HOST,
          port: Number(process.env.PG_DB_PORT),
          username: process.env.PG_DB_USERNAME,
          password: process.env.PG_DB_PASSWORD,
          database: process.env.PG_DB_NAME,
          logging: false,
        },
      },
    )

    app.use(hatchify.middleware.allModels.all)

    server = createServer(app)
    await hatchify.createDatabase()
  })

  afterAll(async () => {
    await hatchify.orm.drop({ cascade: true })
    await hatchify.orm.close()
    await server.close()
  })

  it("should handle JSON:API create body", async () => {
    //JK will separate cases into different it() tests
    const r1 = await POST(
      server,
      "/api/testschema_models",
      serialize({
        firstName: "firstName",
        lastName: "lastName",
        type: "TestSchema_Model",
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
        firstName: "firstName2",
        lastName: "lastName2",
        type: "TestSchema_Model",
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
  })

  it("should be able to omit namespace when referring to fields that belongs to the same namespace", async () => {
    const r1 = await POST(
      server,
      "/api/testschema_models",
      serialize({
        firstName: "firstName",
        lastName: "lastName",
        type: "TestSchema_Model",
      }),
      "application/vnd.api+json",
    )
    expect(r1).toBeTruthy()
    expect(r1.status).toBe(200)

    const namespaceless = await GET(
      server,
      "/api/test-schema/models?fields[Model]=firstName",
    )
    expect(namespaceless).toBeTruthy()
    expect(namespaceless.status).toBe(200)
    const hasNamespace = await GET(
      server,
      "/api/test-schema/models?fields[TestSchema_Model]=firstName",
    )
    expect(hasNamespace).toBeTruthy()
    expect(hasNamespace.status).toBe(200)
    expect(namespaceless).toStrictEqual(hasNamespace)

    // make sure the response have only the requested fields
    namespaceless.deserialized.forEach((record: any) => {
      expect(record).toHaveProperty("first_name")
      expect(record).not.toHaveProperty("last_name")
    })
    hasNamespace.deserialized.forEach((record: any) => {
      expect(record).toHaveProperty("first_name")
      expect(record).not.toHaveProperty("last_name")
    })
  })
})

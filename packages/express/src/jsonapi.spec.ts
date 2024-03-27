import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import { Serializer } from "jsonapi-serializer"

import { startServerWith } from "./testing/utils.js"

describe("JSON:API Tests", () => {
  const Schema = {
    name: "Schema",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  } satisfies PartialSchema

  function serialize(data: any) {
    const serializer = new Serializer("Schema", {
      keyForAttribute: "camelCase",
      attributes: Object.keys(data),
      pluralizeType: false,
    })
    const serial = serializer.serialize(data)
    return serial
  }

  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeAll(async () => {
    ;({ fetch, teardown } = await startServerWith({ Schema }, "sqlite"))
  })

  afterAll(async () => {
    await teardown()
  })

  it("should handle JSON:API create body", async () => {
    await fetch("/api/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName",
        lastName: "lastName",
      }),
    })

    const create = await fetch("/api/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName2",
        lastName: "lastName2",
      }),
    })

    await fetch("/api/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName3",
        lastName: "lastName3",
      }),
    })

    expect(create).toBeTruthy()
    expect(create.status).toBe(200)
    expect(create.body.data).toHaveProperty("id")
    expect(create.body.data.id).toBeTruthy()

    const find = await fetch(`/api/schemas/${create.body.data.id}`)

    expect(find).toBeTruthy()
    expect(find.status).toBe(200)
    expect(find.body).toBeTruthy()
    expect(find.body.data).toBeTruthy()
    expect(find.body.data.id).toBe(create.body.data.id)
  })
})

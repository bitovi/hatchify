import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import dotenv from "dotenv"
import { Serializer } from "jsonapi-serializer"

import { startServerWith } from "./testing/utils.js"

dotenv.config({ path: ".env" })

describe("JSON:API Tests", () => {
  const TestSchema_Schema = {
    name: "Schema",
    namespace: "TestSchema",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  } satisfies PartialSchema

  function serialize(data: any) {
    const serializer = new Serializer("TestSchema_Schema", {
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
    ;({ fetch, teardown } = await startServerWith(
      { TestSchema_Schema },
      "postgres",
    ))
  })

  afterAll(async () => {
    await teardown()
  })

  it("should handle JSON:API create body", async () => {
    //JK will separate cases into different it() tests
    const r1 = await fetch("/api/test-schema/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName",
        lastName: "lastName",
        type: "TestSchema_Schema",
      }),
    })
    expect(r1).toBeTruthy()
    expect(r1.status).toBe(200)
    expect(r1.body.data).toHaveProperty("id")
    expect(r1.body.data.id).toBeTruthy()

    const r2 = await fetch("/api/test-schema/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName2",
        lastName: "lastName2",
        type: "TestSchema_Schema",
      }),
    })

    expect(r2).toBeTruthy()
    expect(r2.status).toBe(200)
    expect(r2.body.data).toHaveProperty("id")
    expect(r2.body.data.id).toBeTruthy()

    const find = await fetch(`/api/test-schema/schemas/${r2.body.data.id}`)

    expect(find).toBeTruthy()
    expect(find.status).toBe(200)
    expect(find.body.data).toBeTruthy()
    expect(find.body.data.id).toBe(r2.body.data.id)
  })

  it("should be able to omit namespace when referring to fields that belongs to the same namespace", async () => {
    const r1 = await fetch("/api/test-schema/schemas", {
      method: "post",
      body: serialize({
        firstName: "firstName",
        lastName: "lastName",
        type: "TestSchema_Schema",
      }),
    })
    expect(r1).toBeTruthy()
    expect(r1.status).toBe(200)

    const namespaceless = await fetch(
      "/api/test-schema/schemas?fields[Schema]=firstName",
    )
    expect(namespaceless).toBeTruthy()
    expect(namespaceless.status).toBe(200)
    const hasNamespace = await fetch(
      "/api/test-schema/schemas?fields[TestSchema_Schema]=firstName",
    )
    expect(hasNamespace).toBeTruthy()
    expect(hasNamespace.status).toBe(200)
    expect(namespaceless.body).toStrictEqual(hasNamespace.body)

    // make sure the response have only the requested fields
    namespaceless.body.data.forEach((record: any) => {
      expect(record.attributes).toHaveProperty("firstName")
      expect(record.attributes).not.toHaveProperty("lastName")
    })
    hasNamespace.body.data.forEach((record: any) => {
      expect(record.attributes).toHaveProperty("firstName")
      expect(record.attributes).not.toHaveProperty("lastName")
    })
  })
})

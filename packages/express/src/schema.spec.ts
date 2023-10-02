import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import Express from "express"

import { Hatchify } from "./express"
import { GET } from "./testing/utils"

describe("Schema Tests", () => {
  const Model: PartialSchema = {
    name: "Model",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }

  it("should create fetch the schema for a specific model", async () => {
    const app = Express()
    const hatchify = new Hatchify({ Model }, { prefix: "/api" })
    app.use((_req, res) => {
      res.json(hatchify.schema.Model)
    })

    const server = app
    await hatchify.createDatabase()

    const find1 = await GET(server, "/")

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)

    await hatchify.orm.close()
  })
})

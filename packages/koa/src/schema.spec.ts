import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import Koa from "koa"

import { Hatchify } from "./koa"
import { GET, createServer } from "./testing/utils"

describe("Schema Tests", () => {
  const Model: HatchifyModel = {
    name: "Model",
    attributes: {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  }

  it("should create fetch the schema for a specific model", async () => {
    const app = new Koa()
    const hatchify = new Hatchify([Model], { prefix: "/api" })
    app.use(async (ctx) => {
      ctx.body = hatchify.schema.Model
    })

    const server = createServer(app)
    await hatchify.createDatabase()

    const find1 = await GET(server, "/")

    expect(find1).toBeTruthy()
    expect(find1.status).toBe(200)

    await hatchify.orm.close()
  })
})

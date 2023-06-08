import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import Express from "express"

import { Hatchify } from "./express"
import { GET, createServer } from "./testing/utils"

describe("Internal Tests", () => {
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

  const Model2: HatchifyModel = {
    name: "Model2",
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

  const Model3: HatchifyModel = {
    name: "Model3",
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

  it("should handle custom user routes", async () => {
    const app = Express()

    const hatchify = new Hatchify([Model, Model2, Model3], {
      prefix: "/api",
    })

    const server = createServer(app)
    await hatchify.createDatabase()

    app.get("/user-custom-route", (_req, res) => {
      res.json({ test: true })
    })

    app.get("/alternative-model-2", async (req, res) => {
      const response = await hatchify.everything.Model.findAll(
        req.originalUrl.split("?")[1] || "",
      )
      res.json({ test: true, data: response })
    })

    app.get("/alternative-model-3", async (_req, res) => {
      const response = await hatchify.everything.allModels.create
      res.json({ test: true, data: response })
    })

    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((_req, res) => {
      res.status(404).json({ error: true, default: true })
    })

    const req1 = await GET(server, "/user-custom-route")
    expect(req1).toBeTruthy()
    expect(req1.status).toBe(200)
    expect(req1.serialized).toHaveProperty("test")

    const req3 = await GET(server, "/alternative-model-2")
    expect(req3).toBeTruthy()
    expect(req3.status).toBe(200)
    expect(req3.serialized).toHaveProperty("test")
    expect(req3.serialized).toHaveProperty("data")

    const req4 = await GET(server, "/unknown-route-404")
    expect(req4).toBeTruthy()
    expect(req4.status).toBe(404)

    await hatchify.orm.close()
  })

  it("should handle allModel custom routes", async () => {
    const app = Express()

    const hatchify = new Hatchify([Model, Model2, Model3], {})

    const server = createServer(app)
    await hatchify.createDatabase()

    app.get("/model3s", hatchify.middleware.allModels.findAll)

    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((_req, res) => {
      res.status(404).json({ error: true, default: true })
    })

    const req6 = await GET(server, "/model3s")
    expect(req6).toBeTruthy()
    expect(req6.status).toBe(200)
    expect(req6.deserialized).toHaveProperty("length")

    await hatchify.orm.close()
  })

  it("should handle custom user auth example", async () => {
    const app = Express()

    const hatchify = new Hatchify([Model], { prefix: "/api" })

    const server = createServer(app)
    await hatchify.createDatabase()

    app.get(
      "/alternative-model",
      async (req, res, next) => {
        if (!req.headers.authorization) {
          return res.status(401).send("Bad Auth")
        }

        return await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((_req, res) => {
      res.status(404).json({ error: true, default: true })
    })

    const req2 = await GET(server, "/alternative-model")
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(200)
    expect(req2.deserialized).toHaveProperty("length")

    await hatchify.orm.close()
  })

  it("should handle custom user auth missing header", async () => {
    const app = Express()

    const hatchify = new Hatchify([Model], { prefix: "/api" })

    const server = createServer(app)
    await hatchify.createDatabase()

    app.get(
      "/alternative-model",
      async (req, res, next) => {
        if (!req.headers.customheader) {
          return res.status(401).send("Bad Auth")
        }

        return await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((_req, res) => {
      res.status(404).json({ error: true })
    })

    const req2 = await GET(server, "/alternative-model")
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(401)

    await hatchify.orm.close()
  })
})

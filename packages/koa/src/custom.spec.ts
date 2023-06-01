import { HatchifyKoa } from "./koa"
import Koa from "koa"
import KoaRouter from "@koa/router"
import type { HatchifyModel } from "./types"
import { DataTypes } from "./types"
import { createServer, GET } from "./testing/utils"

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
    const app = new Koa()
    const router = new KoaRouter()

    const hatchify = new HatchifyKoa([Model, Model2, Model3], {
      prefix: "/api",
    })

    const server = createServer(app)
    await hatchify.createDatabase()

    router.get("/user-custom-route", async (ctx) => {
      ctx.body = { test: true }
    })

    router.get("/alternative-model-2", async (ctx) => {
      const response = await hatchify.everything.Model.findAll(ctx.query)
      ctx.body = { test: true, data: response }
    })

    router.get("/alternative-model-3", async (ctx) => {
      const response = await hatchify.everything.allModels.create
      ctx.body = { test: true, data: response }
    })

    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true, default: true }
      ctx.status = 404
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
    const app = new Koa()
    const router = new KoaRouter()

    const hatchify = new HatchifyKoa([Model, Model2, Model3], {})

    const server = createServer(app)
    await hatchify.createDatabase()

    router.get("/model3s", hatchify.middleware.allModels.findAll)

    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true, default: true }
      ctx.status = 404
    })

    const req6 = await GET(server, "/model3s")
    expect(req6).toBeTruthy()
    expect(req6.status).toBe(200)
    expect(req6.deserialized).toHaveProperty("length")

    await hatchify.orm.close()
  })

  it("should handle custom user auth example", async () => {
    const app = new Koa()
    const router = new KoaRouter()

    const hatchify = new HatchifyKoa([Model], { prefix: "/api" })

    const server = createServer(app)
    await hatchify.createDatabase()

    router.get(
      "/alternative-model",
      async (ctx, next) => {
        if (!ctx.headers.authorization) {
          return ctx.throw(401, "Bad Auth")
        }

        await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true }
      ctx.status = 404
    })

    const req2 = await GET(server, "/alternative-model")
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(200)
    expect(req2.deserialized).toHaveProperty("length")

    await hatchify.orm.close()
  })

  it("should handle custom user auth missing header", async () => {
    const app = new Koa()
    const router = new KoaRouter()

    const hatchify = new HatchifyKoa([Model], { prefix: "/api" })

    const server = createServer(app)
    await hatchify.createDatabase()

    router.get(
      "/alternative-model",
      async (ctx, next) => {
        if (!ctx.headers.customheader) {
          return ctx.throw(401, "Bad Auth")
        }

        await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(router.routes())
    app.use(router.allowedMethods())
    app.use(hatchify.middleware.allModels.all)

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true }
      ctx.status = 404
    })

    const req2 = await GET(server, "/alternative-model")
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(401)

    await hatchify.orm.close()
  })
})

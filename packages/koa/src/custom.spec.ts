import { string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/node"
import KoaRouter from "@koa/router"

import { startServerWith } from "./testing/utils"

describe("Custom Tests", () => {
  const Model: PartialSchema = {
    name: "Model",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }
  const Model2: PartialSchema = {
    name: "Model2",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }
  const Model3: PartialSchema = {
    name: "Model3",
    attributes: {
      firstName: string({ required: true }),
      lastName: string({ required: true }),
    },
  }

  let app: Awaited<ReturnType<typeof startServerWith>>["app"]
  let fetch: Awaited<ReturnType<typeof startServerWith>>["fetch"]
  let hatchify: Awaited<ReturnType<typeof startServerWith>>["hatchify"]
  let teardown: Awaited<ReturnType<typeof startServerWith>>["teardown"]

  beforeEach(async () => {
    ;({ app, fetch, hatchify, teardown } = await startServerWith(
      { Model, Model2, Model3 },
      "sqlite",
    ))
  })

  afterEach(async () => {
    await teardown()
  })

  it("should handle custom user routes", async () => {
    const router = new KoaRouter()

    router.get("/user-custom-route", async (ctx) => {
      ctx.body = { test: true }
    })

    router.get("/alternative-model-2", async (ctx) => {
      const response = await (hatchify as any).everything.Model.findAll(
        ctx.querystring,
      )
      ctx.body = { test: true, data: response }
    })

    router.get("/alternative-model-3", async (ctx) => {
      const response = await (hatchify as any).everything.allModels.create
      ctx.body = { test: true, data: response }
    })

    app.use(router.routes())

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true, default: true }
      ctx.status = 404
    })

    const req1 = await fetch("/user-custom-route")
    expect(req1).toBeTruthy()
    expect(req1.status).toBe(200)

    expect(req1.body).toHaveProperty("test")

    const req3 = await fetch("/alternative-model-2")
    expect(req3).toBeTruthy()
    expect(req3.status).toBe(200)
    expect(req3.body).toHaveProperty("test")
    expect(req3.body).toHaveProperty("data")

    const req4 = await fetch("/unknown-route-404")
    expect(req4).toBeTruthy()
    expect(req4.status).toBe(404)
  })

  it("should handle allModel custom routes", async () => {
    const router = new KoaRouter()

    router.get("/api/model3s", hatchify.middleware.allModels.findAll)

    app.use(router.routes())

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true, default: true }
      ctx.status = 404
    })

    const req6 = await fetch("/api/model3s")
    expect(req6).toBeTruthy()
    expect(req6.status).toBe(200)
    expect(req6.body.data).toHaveProperty("length")
  })

  it("should handle custom user auth example", async () => {
    const router = new KoaRouter()

    router.get(
      "/alternative-model",
      async (ctx, next) => {
        if (!ctx.headers.authorization) {
          return ctx.throw(401, "Bad Auth")
        }

        return await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(router.routes())

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true }
      ctx.status = 404
    })

    const req2 = await fetch("/alternative-model", {
      headers: { authorization: "test" },
    })
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(200)
    expect(req2.body.data).toHaveProperty("length")
  })

  it("should handle custom user auth missing header", async () => {
    const router = new KoaRouter()

    router.get(
      "/alternative-model",
      async (ctx, next) => {
        if (!ctx.headers.customheader) {
          return ctx.throw(401, "Bad Auth")
        }

        return await next()
      },
      hatchify.middleware.Model.findAll,
    )

    app.use(router.routes())

    // Add a fallthrough default handler that just returns not found
    app.use((ctx) => {
      ctx.body = { error: true }
      ctx.status = 404
    })

    const req2 = await fetch("/alternative-model")
    expect(req2).toBeTruthy()
    expect(req2.status).toBe(401)
  })
})

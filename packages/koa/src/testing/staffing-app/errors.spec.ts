import { createServer, GET, POST } from "../utils"
import { codes, statusCodes } from "../../error/constants"
import Koa from "koa"
import KoaRouter from "@koa/router"
import { Hatchify, errorHandlerMiddleware } from "../.."
import { Skill } from "./models/Skill"
import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"

describe("Errors", () => {
  it("should return JSON API error format with Hatchify default middleware", async () => {
    // Create a basic Koa application
    const app = new Koa()
    const router = new KoaRouter()

    // Create a Hatchify instance containing your Models
    const hatchify = new Hatchify(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await hatchify.createDatabase()

    // Hook up the router
    app.use(router.routes())

    // Attach the Hatchify default middleware to your Koa application
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)

    const results = await Promise.all([
      POST(server, "/api/skills", {
        data: {
          type: "skills",
          attributes: {
            name: "react",
          },
        },
      }),
      POST(server, "/api/skills", {
        data: {
          type: "skills",
          attributes: {
            name: "react",
          },
        },
      }),
    ])

    const {
      code,
      source: { pointer },
    } = JSON.parse(
      results.filter((result) => result.status === statusCodes.CONFLICT)[0]
        .text,
    )[0]

    expect(code).toBe(codes.ERR_CONFLICT)
    expect(pointer).toEqual("/data/attributes/name")

    await hatchify.orm.close()
  })

  it("should return JSON API error format with only Hatchify error handler middleware and Hatchify.Error", async () => {
    // Create a basic Koa application
    const app = new Koa()
    const router = new KoaRouter()

    // Create a Hatchify instance containing your Models
    const hatchify = new Hatchify(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await hatchify.createDatabase()

    // Attach the Hatchify default middleware to your Koa application
    app.use(errorHandlerMiddleware)

    app.use(router.routes())

    app.use(hatchify.middleware.allModels.crud)

    const server = createServer(app)

    const errorDetails = {
      code: codes.ERR_PARAMETER_REQUIRED,
      status: statusCodes.UNPROCESSABLE_ENTITY,
    }

    router.get("/err", async () => {
      throw Hatchify.createError(errorDetails)
    })

    const result = await GET(server, "/err")

    const { code, status } = JSON.parse(result.text)[0]

    expect(code).toBe(errorDetails.code)
    expect(result.status).toEqual(status)

    await hatchify.orm.close()
  })
})

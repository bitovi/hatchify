import { createServer, GET, POST } from "../utils"
import { codes, statusCodes } from "../../error/constants"
import Koa from "koa"
import KoaRouter from "@koa/router"
import { Scaffold, errorHandlerMiddleware } from "../.."
import { Skill } from "./models/Skill"
import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"

describe("Errors", () => {
  it("should return JSON API error format with Scaffold default middleware", async () => {
    // Create a basic Koa application
    const app = new Koa()
    const router = new KoaRouter()

    // Create a Scaffold instance containing your Models
    const scaffold = new Scaffold(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await scaffold.createDatabase()

    // Hook up the router
    app.use(router.routes())

    // Attach the Scaffold default middleware to your Koa application
    app.use(scaffold.middleware.allModels.all)

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

    await scaffold.orm.close()
  })

  it("should return JSON API error format with only Scaffold error handler middleware and Scaffold.Error", async () => {
    // Create a basic Koa application
    const app = new Koa()
    const router = new KoaRouter()

    // Create a Scaffold instance containing your Models
    const scaffold = new Scaffold(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await scaffold.createDatabase()

    // Attach the Scaffold default middleware to your Koa application
    app.use(errorHandlerMiddleware)

    app.use(router.routes())

    app.use(scaffold.middleware.allModels.crud)

    const server = createServer(app)

    const errorDetails = {
      code: codes.ERR_PARAMETER_REQUIRED,
      status: statusCodes.UNPROCESSABLE_ENTITY,
    }

    router.get("/err", async () => {
      throw Scaffold.createError(errorDetails)
    })

    const result = await GET(server, "/err")

    const { code, status } = JSON.parse(result.text)[0]

    expect(code).toBe(errorDetails.code)
    expect(result.status).toEqual(status)

    await scaffold.orm.close()
  })
})

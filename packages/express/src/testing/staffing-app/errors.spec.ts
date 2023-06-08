import { codes, statusCodes } from "@hatchifyjs/node"
import Express from "express"

import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"
import { Skill } from "./models/Skill"
import { Hatchify, errorHandlerMiddleware } from "../../express"
import { GET, POST, createServer } from "../utils"

describe("Errors", () => {
  it("should return JSON API error format with Hatchify default middleware", async () => {
    // Create a basic Express application
    const app = Express()

    // Create a Hatchify instance containing your Models
    const hatchify = new Hatchify(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await hatchify.createDatabase()

    // Attach the Hatchify default middleware to your Express application
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
      results.find((result) => result.status === statusCodes.CONFLICT)?.text,
    )[0]

    expect(code).toBe(codes.ERR_CONFLICT)
    expect(pointer).toEqual("/data/attributes/name")

    await hatchify.orm.close()
  })

  it("should return JSON API error format with only Hatchify error handler middleware and Hatchify.Error", async () => {
    // Create a basic Express application
    const app = Express()

    // Create a Hatchify instance containing your Models
    const hatchify = new Hatchify(
      [Assignment, Employee, Project, Role, Skill],
      {
        prefix: "/api",
      },
    )

    await hatchify.createDatabase()

    // Attach the Hatchify default middleware to your Express application
    app.use(errorHandlerMiddleware)

    app.use(hatchify.middleware.allModels.crud)

    const server = createServer(app)

    const errorDetails = {
      code: codes.ERR_PARAMETER_REQUIRED,
      status: statusCodes.UNPROCESSABLE_ENTITY,
    }

    app.get("/err", async () => {
      throw Hatchify.createError(errorDetails)
    })

    const result = await GET(server, "/err")

    const { code, status } = JSON.parse(result.text)[0]

    expect(code).toBe(errorDetails.code)
    expect(status).toEqual(result.status)

    await hatchify.orm.close()
  })
})

import { DataTypes } from "@hatchifyjs/node"
import type { HatchifyModel } from "@hatchifyjs/node"
import Chance from "chance"
import Express from "express"

import { createStaffingAppInstance } from "./staffing"
import { Hatchify } from "../../express"
import { GET, POST, createServer } from "../utils"

const chance = new Chance()
describe("Tests for fields parameter", () => {
  const [app, hatchify] = createStaffingAppInstance()

  beforeAll(async () => {
    await hatchify.createDatabase()
  })

  it("should return only specified fields for find all", async () => {
    const server = createServer(app)

    await POST(server, "/api/employees", {
      name: chance.name(),
      start_date: chance.date(),
    })

    const [employee] = (
      await GET(server, "/api/employees?fields=[Employee]=name,start_date")
    ).deserialized

    expect(employee).toEqual({
      name: expect.any(String),
      start_date: expect.any(String),
    })
  })

  it("should not return virtuals not explicitly specified in query for find all", async () => {
    const Employee: HatchifyModel = {
      name: "Employee",
      attributes: {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        currentProject: {
          type: DataTypes.VIRTUAL(DataTypes.STRING),
          get() {
            return "YUM"
          },
        },
      },
    }

    const app = Express()
    const hatchify = new Hatchify([Employee], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    await POST(server, "/api/employees", {
      name: chance.name(),
    })

    const [employees] = (
      await GET(server, "/api/employees?fields=[Employee]=name")
    ).deserialized

    expect(employees).toEqual(
      expect.not.objectContaining({
        currentProject: expect.any(String),
      }),
    )

    expect(employees).toEqual({
      name: expect.any(String),
    })
  })

  it("should return only specified fields for find by id", async () => {
    const server = createServer(app)

    const { id: employeeId } = (
      await POST(server, "/api/employees", {
        name: chance.name(),
        start_date: chance.date(),
      })
    ).deserialized

    const employee = (
      await GET(
        server,
        `/api/employees/${employeeId}?fields=[Employee]=name,start_date`,
      )
    ).deserialized

    expect(employee).toEqual({
      name: expect.any(String),
      start_date: expect.any(String),
    })
  })

  it("should not return virtuals not explicitly specified in query for find by id", async () => {
    const Employee: HatchifyModel = {
      name: "Employee",
      attributes: {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        currentProject: {
          type: DataTypes.VIRTUAL(DataTypes.STRING),
          get() {
            return "YUM"
          },
        },
      },
    }

    const app = Express()
    const hatchify = new Hatchify([Employee], { prefix: "/api" })
    app.use(hatchify.middleware.allModels.all)

    const server = createServer(app)
    await hatchify.createDatabase()

    const { id: employeeId } = (
      await POST(server, "/api/employees", {
        name: chance.name(),
        age: chance.age(),
      })
    ).deserialized

    const employee = (
      await GET(server, `/api/employees/${employeeId}?fields=[Employee]=name`)
    ).deserialized

    expect(employee).toEqual(
      expect.not.objectContaining({
        currentProject: expect.any(String),
      }),
    )

    expect(employee).toEqual({
      name: expect.any(String),
    })
  })

  it("should not return virtual fields if not specified", async () => {
    const server = createServer(app)

    await POST(server, "/api/employees", {
      name: chance.name(),
    })

    const [employee] = (await GET(server, "/api/employees")).deserialized

    expect(employee).toEqual({
      end_date: null,
      start_date: expect.any(String),
      id: expect.any(String),
      name: expect.any(String),
    })

    expect(employee).toEqual(
      expect.not.objectContaining({
        currentProject: expect.any(String),
      }),
    )
  })

  it("should return virtual fields if specified", async () => {
    const server = createServer(app)

    const [{ deserialized: employee }, { deserialized: project }] =
      await Promise.all([
        POST(server, "/api/employees", {
          name: chance.name(),
          start_date: chance.date(),
        }),
        POST(server, "/api/projects", {
          name: chance.name(),
          description: chance.paragraph(),
        }),
      ])

    const assignmentId = "d317d699-01ba-4a9b-bf3e-7287b7781c57"
    const roleId = "b552e3d5-875e-4084-87dd-47a1bbcb8078"

    await POST(server, "/api/assignments", {
      assignment_id: assignmentId,
      employee_id: employee.id,
      role_id: roleId,
      start_date: new Date(Date.now() - 86400000),
      end_date: new Date(Date.now() + 86400000),
    })

    await POST(server, "/api/roles", {
      id: roleId,
      assignment_id: assignmentId,
      project_id: project.id,
      name: "HatchifyJS",
      start_date: new Date(Date.now() - 86400000),
      start_confidence: 1,
      end_date: new Date(Date.now() + 86400000),
    })

    const [updatedEmployee] = (
      await GET(server, "/api/employees?fields=[Employee]=name,currentProject")
    ).deserialized

    expect(updatedEmployee).toEqual({
      name: expect.any(String),
      current_project: null,
    })
  })
})

import Koa from "koa"
import Chance from "chance"
import { Scaffold } from "../../index"
import { DataTypes, ScaffoldModel } from "../../types"
import { createStaffingAppInstance } from "./staffing"
import { createServer, GET, POST } from "../utils"

const chance = new Chance()
describe("Tests for fields parameter", () => {
  const [app, scaffold] = createStaffingAppInstance()

  beforeAll(async () => {
    await scaffold.createDatabase()
  })

  it("should return only specified fields for find all", async () => {
    const server = createServer(app)

    await POST(server, "/api/employees", {
      name: chance.name(),
      age: chance.age(),
    })

    const [employees] = (
      await GET(server, "/api/employees?fields=[Employee]=name,age")
    ).deserialized

    expect(employees).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
    })
  })

  it("should not return virtuals not explicitly specified in query for find all", async () => {
    const Employee: ScaffoldModel = {
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

    const app = new Koa()
    const scaffold = new Scaffold([Employee], { prefix: "/api" })
    app.use(scaffold.middleware.allModels.all)

    const server = createServer(app)
    await scaffold.createDatabase()

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
        age: chance.age(),
      })
    ).deserialized

    const employee = (
      await GET(
        server,
        `/api/employees/${employeeId}?fields=[Employee]=name,age`,
      )
    ).deserialized

    expect(employee).toEqual({
      name: expect.any(String),
      age: expect.any(Number),
    })
  })

  it("should not return virtuals not explicitly specified in query for find by id", async () => {
    const Employee: ScaffoldModel = {
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

    const app = new Koa()
    const scaffold = new Scaffold([Employee], { prefix: "/api" })
    app.use(scaffold.middleware.allModels.all)

    const server = createServer(app)
    await scaffold.createDatabase()

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
      age: chance.age(),
    })

    const [employees] = (await GET(server, "/api/employees")).deserialized

    expect(employees).toEqual({
      end_date: null,
      start_date: null,
      id: expect.any(String),
      name: expect.any(String),
      age: expect.any(Number),
    })

    expect(employees).toEqual(
      expect.not.objectContaining({
        currentProject: expect.any(String),
      }),
    )
  })

  it("should return virtual fields if specified", async () => {
    const server = createServer(app)

    await POST(server, "/api/employees", {
      name: chance.name(),
      age: chance.age(),
    })
    const [employees] = (
      await GET(server, "/api/employees?fields=[Employee]=name,current_project")
    ).deserialized

    expect(employees).toEqual({
      name: expect.any(String),
      current_project: "Yum",
    })
  })
})

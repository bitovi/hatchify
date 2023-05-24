import { createStaffingAppInstance } from "./staffing"
import { createServer, GET, POST } from "../utils"

describe("Staffing App Example", () => {
  const [app, scaffold] = createStaffingAppInstance()
  beforeAll(async () => {
    await scaffold.createDatabase()
  })

  it("should handle get assignments", async () => {
    const server = createServer(app)

    const findall = await GET(server, "/api/assignments")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle get employees", async () => {
    const server = createServer(app)

    const findall = await GET(server, "/api/employees")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle get projects", async () => {
    const server = createServer(app)

    const findall = await GET(server, "/api/projects")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle get roles", async () => {
    const server = createServer(app)

    const findall = await GET(server, "/api/roles")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle get skills", async () => {
    const server = createServer(app)

    const findall = await GET(server, "/api/skills")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle complex validation", async () => {
    const server = createServer(app)

    const assignment = await POST(server, "/api/assignments", {
      employee_id: 1,
      start_date: new Date(),
      end_date: new Date(),
    })

    expect(assignment).toBeTruthy()
  })

  afterAll(async () => {
    await scaffold.orm.close()
  })
})

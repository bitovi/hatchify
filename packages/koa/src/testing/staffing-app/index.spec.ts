import { createStaffingAppInstance } from "./staffing"
import { GET, PATCH, POST, createServer } from "../utils"

describe("Staffing App Example", () => {
  const [app, hatchify] = createStaffingAppInstance()
  const server = createServer(app)
  let employees
  let projects
  let skills

  beforeAll(async () => {
    await hatchify.createDatabase()

    const results = await Promise.all([
      POST(server, "/api/employees", {
        name: "employee1",
        start_date: "2022-01-01T00:00:00.000Z",
        end_date: "2023-12-31T00:00:00.000Z",
        age: 18,
      }),
      POST(server, "/api/employees", {
        name: "employee2",
        start_date: "2022-01-01T00:00:00.000Z",
        end_date: "2023-12-31T00:00:00.000Z",
        age: 28,
      }),
      POST(server, "/api/projects", {
        name: "project1",
        description: "project1 description",
      }),
      POST(server, "/api/projects", {
        name: "project2",
        description: "project2 description",
      }),
      POST(server, "/api/skills", {
        name: "skill1",
      }),
      POST(server, "/api/skills", {
        name: "skill2",
      }),
    ])

    employees = results
      .filter((result) => result.serialized.data.type === "Employee")
      .map((result) => result.deserialized)
    projects = results
      .filter((result) => result.serialized.data.type === "Project")
      .map((result) => result.deserialized)
    skills = results
      .filter((result) => result.serialized.data.type === "Skill")
      .map((result) => result.deserialized)
  })

  afterAll(async () => {
    await hatchify.orm.close()
  })

  it("should handle get assignments", async () => {
    const findall = await GET(server, "/api/assignments")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle get employees", async () => {
    const { serialized } = await GET(server, "/api/employees?include=skills")
    expect(serialized).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Employee",
          id: expect.any(String),
          attributes: {
            name: "employee1",
            start_date: "2022-01-01T00:00:00.000Z",
            end_date: "2023-12-31T00:00:00.000Z",
          },
          relationships: {
            skills: { data: [] },
          },
        },
        {
          type: "Employee",
          id: expect.any(String),
          attributes: {
            name: "employee2",
            start_date: "2022-01-01T00:00:00.000Z",
            end_date: "2023-12-31T00:00:00.000Z",
          },
          relationships: {
            skills: { data: [] },
          },
        },
      ],
    })
  })

  it("should handle get projects", async () => {
    const { serialized } = await GET(server, "/api/projects")
    expect(serialized).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          id: expect.any(String),
          type: "Project",
          attributes: { name: "project1", description: "project1 description" },
        },
        {
          id: expect.any(String),
          type: "Project",
          attributes: { name: "project2", description: "project2 description" },
        },
      ],
    })
  })

  it("should handle get roles", async () => {
    const findall = await GET(server, "/api/roles")
    expect(findall).toBeTruthy()
    expect(findall.status).toBe(200)
    expect(findall.deserialized).toHaveProperty("length")
    expect(findall.deserialized.length).toBe(0)
  })

  it("should handle post roles", async () => {
    const { serialized } = await POST(
      server,
      "/api/roles",
      {
        jsonapi: { version: "1.0" },
        data: {
          type: "Role",
          attributes: {
            start_date: "2023-01-01",
            start_confidence: 0.2,
            end_date: "2023-12-31",
            end_confidence: 0.7,
          },
          relationships: {
            project: {
              data: {
                type: "Project",
                id: projects[0].id,
              },
            },
            skills: {
              data: [{ type: "Skill", id: skills[0].id }],
            },
          },
        },
        included: [
          {
            type: "Project",
            id: projects[0].id,
            attributes: {
              name: projects[0].name,
              description: projects[0].description,
            },
          },
          {
            type: "Skill",
            id: skills[0].id,
            attributes: { name: skills[0].name },
          },
        ],
      },
      "application/vnd.api+json",
    )

    expect(serialized).toEqual({
      jsonapi: { version: "1.0" },
      data: {
        type: "Role",
        id: expect.any(String),
        attributes: {
          start_date: "2023-01-01T00:00:00.000Z",
          start_confidence: 0.2,
          end_date: "2023-12-31T00:00:00.000Z",
          end_confidence: 0.7,
        },
      },
    })
  })

  it("should handle patch employee with skills", async () => {
    const { serialized } = await PATCH(
      server,
      `/api/employees/${employees[0].id}`,
      {
        jsonapi: { version: "1.0" },
        data: {
          type: "Employee",
          attributes: {
            name: employees[0].name,
            start_date: employees[0].start_date,
            end_date: employees[0].end_date,
          },
          relationships: {
            skills: {
              data: [{ type: "skills", id: skills[0].id }],
            },
          },
        },
      },
      "application/vnd.api+json",
    )
    expect(serialized).toEqual({ jsonapi: { version: "1.0" }, data: null })

    const { serialized: updated } = await GET(
      server,
      `/api/employees/${employees[0].id}?include=skills`,
    )

    expect(updated).toEqual({
      jsonapi: { version: "1.0" },
      data: {
        type: "Employee",
        id: employees[0].id,
        attributes: {
          name: employees[0].name,
          start_date: employees[0].start_date,
          end_date: employees[0].end_date,
        },
        relationships: {
          skills: {
            data: [{ type: "Skill", id: skills[0].id }],
          },
        },
      },
      included: [
        {
          type: "Skill",
          id: skills[0].id,
          attributes: { name: skills[0].name },
        },
      ],
    })
  })

  it("should handle get skills", async () => {
    const { serialized } = await GET(
      server,
      "/api/skills?include=employees.skills,employees.assignments.role.skills,employees.assignments.role.project",
    )
    expect(serialized).toEqual({
      jsonapi: { version: "1.0" },
      data: [
        {
          type: "Skill",
          id: skills[0].id,
          attributes: { name: skills[0].name },
          relationships: {
            employees: {
              data: [
                {
                  type: "Employee",
                  id: employees[0].id,
                },
              ],
            },
          },
        },
        {
          type: "Skill",
          id: skills[1].id,
          attributes: { name: skills[1].name },
          relationships: { employees: { data: [] } },
        },
      ],
      included: [
        {
          type: "Skill",
          id: skills[0].id,
          attributes: { name: skills[0].name },
        },
        {
          type: "Employee",
          id: employees[0].id,
          attributes: {
            name: employees[0].name,
            start_date: employees[0].start_date,
            end_date: employees[0].end_date,
            currentProject: null,
          },
          relationships: {
            skills: {
              data: [{ type: "Skill", id: skills[0].id }],
            },
            assignments: { data: [] },
          },
        },
      ],
    })
  })

  it("should handle complex validation", async () => {
    const assignment = await POST(server, "/api/assignments", {
      employee_id: 1,
      start_date: new Date(),
      end_date: new Date(),
    })

    expect(assignment).toBeTruthy()
  })
})

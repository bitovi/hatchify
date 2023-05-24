/* eslint-disable @typescript-eslint/no-explicit-any */
import Chance from "chance"
import { Scaffold } from "../../index"
import type { ScaffoldModel } from "../../types"
import { DataTypes } from "../../types"
import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"
import { Skill } from "./models/Skill"

const chance = new Chance()

describe("Virtuals Tests", () => {
  it("should return scaffold virtuals", () => {
    const Sample: ScaffoldModel = {
      name: "Sample",
      attributes: {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        noOfRoles: {
          type: DataTypes.VIRTUAL(DataTypes.INTEGER),
          include: "roles",
          get() {
            return this.roles.length
          },
        },
      },
    }

    const scaffold = new Scaffold([Sample])

    expect(scaffold.virtuals).toStrictEqual({
      Sample: { noOfRoles: [{ association: "roles", include: [] }] },
    })
  })

  it("should return scaffold virtuals without include", () => {
    const Sample: ScaffoldModel = {
      name: "Sample",
      attributes: {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        nameInCaps: {
          type: DataTypes.VIRTUAL(DataTypes.STRING),
          get() {
            return this.name.toUpperCase()
          },
        },
      },
    }

    const scaffold = new Scaffold([Sample])

    expect(scaffold.virtuals).toStrictEqual({ Sample: { nameInCaps: [] } })
  })

  it("should return virtual field with include in query options", async () => {
    const scaffold = new Scaffold([Project, Role, Assignment, Skill, Employee])

    await scaffold.createDatabase()

    const project: any = await scaffold.model.Project.create({
      name: chance.word(),
    })

    await scaffold.model.Role.bulkCreate([
      {
        name: chance.word(),
        project_id: project.id,
        start_date: new Date(),
        start_confidence: chance.floating({ min: 0, max: 1 }),
      },
      {
        name: chance.word(),
        project_id: project.id,
        start_date: new Date(),
        start_confidence: chance.floating({ min: 0, max: 1 }),
      },
    ])

    const projectFindAll: any[] = await scaffold.model.Project.findAll({
      include: ["roles"],
    })

    const projectFindOne: any = await scaffold.model.Project.findOne({
      where: {
        id: project.id,
      },
      include: "roles",
    })

    const projectFindByPk: any = await scaffold.model.Project.findByPk(
      project.id,
      { include: "roles" },
    )

    const projectFindOrCreate: any = await scaffold.model.Project.findOne({
      where: {
        id: project.id,
      },
      include: ["roles"],
    })

    expect(projectFindAll[0].noOfRoles).toBe(2)
    expect(projectFindOne.noOfRoles).toBe(2)
    expect(projectFindByPk.noOfRoles).toBe(2)
    expect(projectFindOrCreate.noOfRoles).toBe(2)

    await scaffold.orm.close()
  })
})

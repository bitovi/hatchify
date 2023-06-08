import { Op } from "@hatchifyjs/node"
import Express from "express"
import type { Model } from "sequelize"

import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"
import { Skill } from "./models/Skill"
import { Hatchify } from "../../express"

interface Assignment {
  id: string
  employee_id: number
  start_date: Date
  end_date: Date
}

export function createStaffingAppInstance(): [any, Hatchify] {
  // Create a basic Express application
  const app = Express()

  // Create a Hatchify instance containing your Models
  const hatchify = new Hatchify([Assignment, Employee, Project, Role, Skill], {
    prefix: "/api",
    expose: true,
  })

  // Set up your Express app as normal, for example, a logging middleware
  app.use(async (req, res, next) => {
    // eslint-disable-next-line no-console
    console.info("Incoming Request: ", req.method, req.path)
    await next()
  })

  app.get("/skill", async (req, res) => {
    const params = await hatchify.parse.Skill.findAndCountAll(
      req.originalUrl.split("?")[1] || "",
    )
    const result = await hatchify.model.Skill.findAndCountAll(params)
    const response = await hatchify.serialize.Skill.findAndCountAll(
      result,
      params.attributes,
    )
    res.json({ customRouteTest1: true, data: response })
  })

  app.get("/skill2", async (req, res) => {
    const response = await hatchify.everything.Skill.findAll(
      req.originalUrl.split("?")[1] || "",
    )
    res.json({ customRouteTest2: true, data: response })
  })

  app.get("/skill3", hatchify.middleware.Skill.findAll)

  app.get(
    "/skill-special-auth",
    async (req, res, next) => {
      if (!req.headers.authorization) {
        return res
          .status(401)
          .json({ message: "This route requires authorization" })
      }
      return await next()
    },
    hatchify.middleware.Skill.findAndCountAll,
  )

  app.get("/test-special-thing/:model", hatchify.middleware.allModels.crud)

  app.post("/Assignment", async (req, res) => {
    // Run a parse first to do a general check that all the required
    // information is there, before we start the transactions and everything
    // If this doesnt pass we can fail fast and just bail out.
    const createOptions = await hatchify.parse.Assignment.create(req.body)

    const { start_date, end_date, employee_id } = <Assignment>req.body

    // Get a transaction
    const check_overlap = await hatchify.orm.transaction()

    let assignmentsForEmployee: Model[] = []
    assignmentsForEmployee = await hatchify.model.Assignment.findAll({
      where: {
        employee_id: employee_id,
      },
      transaction: check_overlap,
    })

    assignmentsForEmployee = await hatchify.model.Assignment.findAll({
      where: {
        employee_id: employee_id,
        [Op.and]: {
          start_date: {
            [Op.gt]: start_date,
          },
          end_date: {
            [Op.lt]: end_date,
          },
        },
      },
      transaction: check_overlap,
    })

    if (assignmentsForEmployee.length > 0) {
      await check_overlap.rollback()
      return res.status(409).send("EMPLOYEE_ALREADY_ASSIGNED")
    }

    const assignment = await hatchify.model.Assignment.create(
      createOptions.body,
      { ...createOptions.ops, transaction: check_overlap },
    )
    const result = await hatchify.serialize.Assignment.create(assignment)
    await check_overlap.commit()

    return res.status(201).json(result)
  })

  // app.use(hatchify.middleware.allModels);

  // Attach the Hatchify default middleware to your Express application
  app.use(hatchify.middleware.Project.all)

  // Set up any other Express routes, middleware, etc, that you want.
  app.use(async (_req, res) => {
    res.json({ response: "Default Router Hit" })
  })

  return [app, hatchify]
}

import { Hatchify, Op } from "../../exports"
import type { Context } from "koa"
import Koa from "koa"
import signale from "signale"
import KoaRouter from "@koa/router"

import { Assignment } from "./models/Assignment"
import { Employee } from "./models/Employee"
import { Project } from "./models/Project"
import { Role } from "./models/Role"
import { Skill } from "./models/Skill"
import type { Model } from "sequelize"

export function createStaffingAppInstance(): [Koa, Hatchify] {
  // Create a basic Koa application
  const app = new Koa()
  const router = new KoaRouter()

  // Create a Hatchify instance containing your Models
  const hatchify = new Hatchify([Assignment, Employee, Project, Role, Skill], {
    prefix: "/api",
    expose: true,
  })

  // Set up your Koa app as normal, for example, a logging middleware
  app.use(async (ctx, next) => {
    signale.info("Incoming Request: ", ctx.method, ctx.path)
    await next()
  })

  router.get("/skill", async (ctx: Context) => {
    const params = await hatchify.parse.Skill.findAndCountAll(ctx.querystring)
    const result = await hatchify.model.Skill.findAndCountAll(params)
    const response = await hatchify.serialize.Skill.findAndCountAll(
      result,
      params.attributes,
    )
    ctx.body = { customRouteTest1: true, data: response }
  })

  router.get("/skill2", async (ctx: Context) => {
    const response = await hatchify.everything.Skill.findAll(ctx.querystring)
    ctx.body = { customRouteTest2: true, data: response }
  })

  router.get("/skill3", hatchify.middleware.Skill.findAll)

  router.get(
    "/skill-special-auth",
    async (ctx, next) => {
      if (!ctx.headers.authorization) {
        return ctx.throw("This route requires authorization")
      }
      return await next()
    },
    hatchify.middleware.Skill.findAndCountAll,
  )

  router.get("/test-special-thing/:model", hatchify.middleware.allModels.crud)

  router.post("/Assignment", async (ctx) => {
    // Run a parse first to do a general check that all the required
    // information is there, before we start the transactions and everything
    // If this doesnt pass we can fail fast and just bail out.
    const createOptions = await hatchify.parse.Assignment.create(ctx.body)

    const { start_date, end_date, employee_id } = ctx.body

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
      ctx.throw(409, "EMPLOYEE_ALREADY_ASSIGNED")
    }

    const assignment = await hatchify.model.Assignment.create(
      createOptions.body,
      { ...createOptions.ops, transaction: check_overlap },
    )
    const result = await hatchify.serialize.Assignment.create(assignment)
    await check_overlap.commit()

    ctx.body = result
    ctx.status = 201
  })

  // Hook up the router
  app.use(router.routes())
  app.use(router.allowedMethods())

  // app.use(hatchify.middleware.allModels);

  // Attach the Hatchify default middleware to your Koa application
  app.use(hatchify.middleware.Project.all)

  // Set up any other Koa routes, middleware, etc, that you want.
  app.use(async (ctx) => {
    ctx.body = { response: "Default Router Hit" }
  })

  return [app, hatchify]
}

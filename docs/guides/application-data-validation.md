# Application Data Validation

One of the most important things when building CRUD applications is data integrity. Hatchify can help here as well by providing easy hooks to provide validation logic. These functions are extremely helpful when trying to compare between values within your model when creating or updating a record.

For an example, if we created an Employee model that describes someone working at a company, we might want to know the first name, last name, as well as their start date, and end date of employment.

An important validation here would be to verify that we don't create (or update) a user to have an end_date that is before their start date!

```typescript
// hatchify-app/schemas.ts
import { datetime, string } from "@hatchify/core"
import type { PartialSchema } from "@hatchify/core"
import { UnexpectedValueError } from "@hatchifyjs/koa"

export const Employee = {
  name: "Employee",
  attributes: {
    firstName: string(),
    lastName: string(),
    startDate: datetime(),
    endDate: datetime(),
  },
  // 🛑
  validation: {
    startDateBeforeEndDate() {
      const { startDate, endDate } = this as unknown as { startDate: Date; endDate: Date }
      if (startDate && endDate && startDate > endDate) {
        throw [
          new UnexpectedValueError({
            detail: "Start date cannot be after end date.",
            pointer: "data/attributes/startDate",
          }),
        ]
      }
    },
  },
} satisfies PartialSchema
```

## Advanced Data Validation

Lets take a look at doing more complicated data validation using Hatchify. In the example below we have two Models, Assignment and Employee. In this situation we have employees that we need to assign work to, but an employee can only be on one assignment at a time.

At create time, how can we verify that the employee is not already working on a project? In other words, the start and end date for an assignment cannot have any overlap for the same employee.

In order to achieve this we can start by creating an override for the Assignment ‘create’ function. Our new behavior should do the following:

- Check that the incoming body is, generally, valid to create an Assignment. If not, we can error and return early
- Start a transaction so we can be sure that the data for this create stays in sync with our validation
- Do the actual date overlap check, this is a series of database queries
  - If we do have overlap, rollback the transaction and error
  - If we do not have overlap, allow assignment creation

The following example code shows one way of tackling this problem:

```typescript
// hatchify-app/backend/index.ts
import Koa from "koa"
import KoaRouter from "@koa/router"
import { hatchifyKoa, Op, UnexpectedValueError } from "@hatchifyjs/koa"
import { Assignment, Employee } from "../schemas.js"

const app = new Koa()
const router = new KoaRouter()

const hatchedKoa = hatchifyKoa({ Assignment, Employee }, { prefix: "/api" })

router.post("/api/assignments", async (ctx, next) => {
  // Run a parse first to do a general check that all the required
  // information is there, before we start the transactions and everything
  // If this doesn't pass we can fail fast and just bail out.
  const createOptions = await hatchedKoa.parse.Assignment.create(ctx.body)

  const { startDate, endDate, employeeId } = <Assignment>ctx.body

  // Wrap with a managed Sequelize transaction
  await hatchedKoa.orm.transaction(async (transaction) => {
    let assignmentsForEmployee = await hatchedKoa.model.Assignment.findAll({
      where: { employeeId },
      transaction,
    })

    assignmentsForEmployee = await hatchedKoa.model.Assignment.findAll({
      where: {
        employeeId,
        startDate: { [Op.gt]: startDate },
        endDate: { [Op.lt]: endDate },
      },
      transaction,
    })

    if (assignmentsForEmployee.length) {
      throw [
        new UnexpectedValueError({
          detail: "Employee already assigned.",
          pointer: "data/attributes/startDate",
        }),
      ]
    }

    const assignment = await hatchedKoa.model.Assignment.create(createOptions.body, { ...createOptions.ops, transaction })
    const result = await hatchedKoa.serialize.Assignment.create(assignment)
  })

  ctx.status = 201
  ctx.body = result
})
;(async () => {
  await hatchedKoa.modelSync({ alter: true })

  app.use(router.routes())
  app.use(hatchedKoa.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

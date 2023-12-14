# Adding custom endpoints

While Hatchify gives you a lot of power out of the box many applications, especially as they grow in complexity, need to apply custom rules and logic to their CRUD operations. Hatchify is prepared for this as well, allowing you to easily and flexibly override any of the default behavior to fit your needs. Even though you have customized the solution you can still use many of the Hatchify helper functions and features to accelerate even your custom workflow development.

This is helpful if you need to:

- Enforce request authorization
- Add custom validation
- Integrate with 3rd party services
- Handle file uploads/downloads

## Prerequisites

If you are using Koa, we suggest using the Koa Router to help creating custom routes easily:

```bash
npm install @koa/router
npm install @types/koa__router --save-dev
```

## Example

```typescript
import querystring from "node:querystring"
import Koa from "koa"
import KoaRouter from "@koa/router" // 👀
import { hatchifyKoa } from "@hatchifyjs/koa"
import * as Schemas from "../schemas"

const app = new Koa()
const hatchedKoa = hatchifyKoa(Schemas, {
  prefix: "/api",
  database: {
    uri: process.env.DB_URI,
  },
})

// Creating a Koa Router
const router = new KoaRouter() // 👀

// Adding the custom route (or override the Hatchify one if already exists)
router.get("/api/cases", async function getCases(ctx): Promise<void> {
  const { query } = ctx

  // Here is a good opportunity to manipulate the query.
  // For ex. when the UI shows one column for name it sends `{ sort: "name" }`
  // we might want to change it to `{ sort: "lastName,firstName,middleInitial" }`

  const findOptions = await hatchedKoa.parse.Case.findAndCountAll(querystring.stringify(query))

  // `findOptions` is the query object we pass to `Sequelize`.
  // This is where you might want to enforce more complex AND/OR logic
  // or filter data the user is unauthorized to fetch.

  const cases = await hatchedKoa.model.Case.findAndCountAll(findOptions)

  // Here you might want to adjust the returned data before it is serialized and returned to the client.

  ctx.body = await hatchedKoa.serialize.Case.findAndCountAll(cases, findOptions.attributes)
})
;(async () => {
  app.use(router.routes()) // 👀
  app.use(hatchedKoa.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

import type { ExpressMiddleware } from "@hatchifyjs/express"
import type { KoaMiddleware } from "@hatchifyjs/koa"
import { Command } from "commander"

import {
  getDatabaseConfiguration,
  getHatchFunction,
  setupExpress,
  setupKoa,
} from "./util.js"
import * as schemas from "../schemas.js"

const options = new Command()
  .requiredOption("-f, --framework <express|koa>", "Node framework")
  .requiredOption("-d, --database <sqlite|rds|postgres>", "Database type")
  .parse()
  .opts()

const hatchedNode = getHatchFunction(options.framework)(schemas, {
  prefix: "/api",
  database: getDatabaseConfiguration(options.database),
})

;(async () => {
  await hatchedNode.modelSync({ alter: true })
  ;(await setupApp(hatchedNode.middleware.allModels.all)).listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log("Started on http://localhost:3000")
  })
})()

async function setupApp(middleware: ExpressMiddleware | KoaMiddleware) {
  if (options.framework === "express") {
    return setupExpress(middleware as ExpressMiddleware)
  }
  return setupKoa(middleware as KoaMiddleware)
}

import { Command } from "commander"
import * as schemas from "../schemas.js"
import {
  getDatabaseConfiguration,
  getHatchFunction,
  setupExpress,
  setupKoa,
} from "./util.js"
import { Middleware as KoaMiddleware } from "koa"
import { ExpressMiddleware } from "@hatchifyjs/express"

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
    console.log("Started on http://localhost:3000")
  })
})()

async function setupApp(middleware: KoaMiddleware | ExpressMiddleware) {
  if (options.framework === "express") {
    return setupExpress(middleware as ExpressMiddleware)
  }

  return setupKoa(middleware as KoaMiddleware)
}

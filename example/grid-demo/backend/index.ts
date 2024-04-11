import type { Hatchify as HatchifyExpress } from "@hatchifyjs/express"
import type { Hatchify as HatchifyKoa } from "@hatchifyjs/koa"
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

  const port = +(process.env.APP_PORT ?? "3000")

  ;(await setupApp(hatchedNode)).listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Started on http://localhost:${port}`)
  })
})()

async function setupApp(hatchedNode: HatchifyKoa | HatchifyExpress) {
  if (options.framework === "express") {
    return setupExpress(hatchedNode as HatchifyExpress)
  }
  return setupKoa(hatchedNode as HatchifyKoa)
}

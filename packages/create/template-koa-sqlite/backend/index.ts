import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import * as Schemas from "../schemas"

const app = new Koa()
const hatchedKoa = hatchifyKoa(Schemas, {
  prefix: "/api",
  database: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
})

app.use(cors())
app.use(hatchedKoa.middleware.allModels.all)
;(async () => {
  await hatchedKoa.createDatabase()

  app.listen(3000, () => {
    console.log("Started on port 3000")
  })
})()

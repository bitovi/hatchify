import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import { Document } from "../schemas/Document"

const app = new Koa()
const hatchedKoa = hatchifyKoa([Document], {
  prefix: "/api",
  database: {
    dialect: "sqlite",
    storage: "example.sqlite",
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

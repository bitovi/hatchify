import Express from "express"
import cors from "cors"
import { hatchifyExpress } from "@hatchifyjs/express"
import * as Schemas from "../schemas"

const app = Express()
const hatchedExpress = hatchifyExpress(Schemas, {
  prefix: "/api",
  database: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  },
})

app.use(cors())
app.use(hatchedExpress.middleware.allModels.all)
;(async () => {
  await hatchedExpress.createDatabase()

  app.listen(3000, () => {
    console.log("Started on port 3000")
  })
})()

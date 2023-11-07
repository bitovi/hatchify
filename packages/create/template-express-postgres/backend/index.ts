import dotenv from "dotenv"
import Express from "express"
import cors from "cors"
import { hatchifyExpress } from "@hatchifyjs/express"
import * as Schemas from "../schemas"

dotenv.config()

const app = Express()
const hatchedExpress = hatchifyExpress(Schemas, {
  prefix: "/api",
  database: {
    dialect: "postgres",
    host: process.env.PG_DB_HOST,
    port: Number(process.env.PG_DB_PORT),
    username: process.env.PG_DB_USERNAME,
    password: process.env.PG_DB_PASSWORD,
    database: process.env.PG_DB_NAME,
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
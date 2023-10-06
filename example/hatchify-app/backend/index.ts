// hatchify-app/backend/index.ts
import Koa from "koa"
import cors from "@koa/cors"
import { hatchifyKoa } from "@hatchifyjs/koa"
import { Todo } from "../schemas/todo"
import { User } from "../schemas/user"

import dotenv from "dotenv" // 👀
dotenv.config() // 👀

const app = new Koa()
const hatchedKoa = hatchifyKoa([Todo, User], {
  prefix: "/api",
  database: {
    dialect: "postgres", // 👀
    host: process.env.PG_DB_HOST, // 👀
    port: Number(process.env.PG_DB_PORT), // 👀
    username: process.env.PG_DB_USERNAME, // 👀
    password: process.env.PG_DB_PASSWORD, // 👀
    database: process.env.PG_DB_NAME, // 👀
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

import Koa from "koa"
import c2k from "koa-connect"
import { createServer as createViteServer } from 'vite'
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

;(async () => {
  await hatchedKoa.createDatabase()

  const vite = await createViteServer({
    root: `${__dirname}/../`,
    server: { middlewareMode: true }
  })

  app.use(hatchedKoa.middleware.allModels.all)
  app.use(c2k(vite.middlewares))

  app.listen(3000, () => {
    console.log("Started on port 3000")
  })
})()
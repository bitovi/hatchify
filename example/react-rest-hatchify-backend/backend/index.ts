import { dirname } from "path"
import { fileURLToPath } from "url"
import Koa from "koa"
import c2k from "koa-connect"
import { createServer as createViteServer } from "vite"
import { hatchifyKoa } from "@hatchifyjs/koa"
import * as schemas from "../schemas.js"

const currentDir = dirname(fileURLToPath(import.meta.url))

const app = new Koa()
const hatchedKoa = hatchifyKoa(schemas, { prefix: "/api" })

;(async () => {
  await hatchedKoa.modelSync({ alter: true })

  const vite = await createViteServer({
    root: `${currentDir}/../`,
    server: { middlewareMode: true },
  })

  app.use(hatchedKoa.middleware.allModels.all)
  app.use(c2k(vite.middlewares))

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()

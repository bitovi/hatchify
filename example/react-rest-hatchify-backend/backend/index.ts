// hatchify-app/backend/index.ts
import Koa from "koa"
import c2k from "koa-connect"
// @ts-expect-error @todo make TS happy here
import { createServer as createViteServer } from "vite"
import { hatchifyKoa } from "@hatchifyjs/koa"
import * as schemas from "../schemas"

const app = new Koa()
const hatchedKoa = hatchifyKoa(schemas, { prefix: "/api" })

;(async () => {
  await hatchedKoa.modelSync({ alter: true })

  const vite = await createViteServer({
    root: `${__dirname}/../`,
    server: { middlewareMode: true },
  })

  app.use(hatchedKoa.middleware.allModels.all)
  app.use(c2k(vite.middlewares))

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()

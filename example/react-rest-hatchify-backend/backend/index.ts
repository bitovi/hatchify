// hatchify-app/backend/index.ts
import Koa from "koa"
import c2k from "koa-connect"
// @ts-expect-error @todo make TS happy here
import { createServer as createViteServer } from "vite.mts"
import { hatchifyKoa } from "@hatchifyjs/koa"
import { Todo } from "../schemas/todo"
import { User } from "../schemas/user"

const app = new Koa()
const hatchedKoa = hatchifyKoa({ Todo, User }, { prefix: "/api" })

;(async () => {
  await hatchedKoa.modelSync({ alter: true })

  const vite = await createViteServer({
    root: `${__dirname}/../`,
    server: { middlewareMode: true },
  })

  app.use(hatchedKoa.middleware.allModels.all)
  app.use(c2k(vite.middlewares))

  app.listen(3000, () => {
    console.log("Started on port 3000")
  })
})()

import { dirname } from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import Express from "express"
import Koa from "koa"
import c2k from "koa-connect"
import { createServer as createViteServer } from "vite"
import type {
  DatabaseOptions,
  ExpressMiddleware,
  Hatchify as HatchifyExpress,
  HatchifyOptions,
  PartialSchema,
} from "@hatchifyjs/express"
import { hatchifyExpress } from "@hatchifyjs/express"
import type { Hatchify as HatchifyKoa } from "@hatchifyjs/koa"
import { hatchifyKoa } from "@hatchifyjs/koa"
import Application from "koa"

const currentDir = dirname(fileURLToPath(import.meta.url))

export function getHatchFunction(
  framework: "express" | "koa",
): (
  schemas: Record<string, PartialSchema>,
  options?: HatchifyOptions,
) => HatchifyExpress | HatchifyKoa {
  if (framework === "express") return hatchifyExpress
  return hatchifyKoa
}

export function getDatabaseConfiguration(
  database: "postgres" | "rds" | "sqlite",
): DatabaseOptions {
  return database === "rds"
    ? {
        uri: `${process.env.DB_URI}?ssl=true`,
        additionalOptions: {
          ssl: {
            rejectUnauthorized: false,
            ca: [
              fs.readFileSync(currentDir + "/../rds-combined-ca-bundle.pem"),
            ],
          },
        },
      }
    : { uri: process.env.DB_URI }
}

export async function setupExpress(middleware: ExpressMiddleware) {
  const app = Express()

  const vite = await createViteServer({
    root: `${currentDir}/../`,
    server: { middlewareMode: true },
  })

  app.use((req, res, next) => {
    if (req.url.startsWith("/api")) {
      next()
    } else {
      vite.middlewares.handle(req, res, next)
    }
  })

  app.use(middleware)
  return app
}

export async function setupKoa(middleware: Application.Middleware) {
  const app = new Koa()

  const vite = await createViteServer({
    root: `${currentDir}/../`,
    server: { middlewareMode: true },
  })

  app.use(middleware)

  app.use(c2k(vite.middlewares))

  return app
}

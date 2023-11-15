import { blue, green, yellow } from "kolorist"
import type { Dialect, Framework } from "./types"

export const FRAMEWORKS: Record<string, Framework> = {
  EXPRESS: {
    name: "express",
    display: "Express",
    color: yellow,
    dependencies: ["express", "cors", "@hatchifyjs/express"],
    devDependencies: ["@types/cors"],
  },
  KOA: {
    name: "koa",
    display: "Koa",
    color: green,
    dependencies: ["koa", "@koa/cors", "@hatchifyjs/koa"],
    devDependencies: ["@types/koa", "@types/koa__cors"],
  },
}

export const DIALECTS: Record<string, Dialect> = {
  POSTGRES: {
    name: "postgres",
    display: "Postgres",
    color: yellow,
    dependencies: ["pg", "dotenv"],
    devDependencies: ["@types/pg"],
  },
  SQLITE: {
    name: "sqlite",
    display: "SQLite",
    color: blue,
    dependencies: ["sqlite3"],
    devDependencies: [],
  },
}

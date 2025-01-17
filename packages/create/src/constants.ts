import { blue, green, yellow } from "kolorist"
import type { Database, Backend, Frontend } from "./types"

export const BACKENDS: Record<string, Backend> = {
  KOA: {
    name: "koa",
    display: "Koa",
    color: green,
    dependencies: ["koa", "@hatchifyjs/koa"],
    devDependencies: ["@types/koa", "koa-connect"],
  },
  EXPRESS: {
    name: "express",
    display: "Express",
    color: yellow,
    dependencies: ["express", "@hatchifyjs/express"],
    devDependencies: [],
  },
}

export const DATABASES: Record<string, Database> = {
  SQLITE: {
    name: "sqlite",
    display: "SQLite",
    color: blue,
    dependencies: ["sqlite3"],
    devDependencies: [],
  },
  POSTGRES: {
    name: "postgres",
    display: "Postgres",
    color: yellow,
    dependencies: ["pg", "dotenv"],
    devDependencies: ["@types/pg"],
  },
}

export const FRONTENDS: Record<string, Frontend> = {
  REACT: {
    name: "react",
    display: "React",
    color: yellow,
    dependencies: [],
    devDependencies: [
      "@hatchifyjs/react",
      "@mui/material",
      "@emotion/react",
      "@emotion/styled",
      "vite",
    ],
  },
}

import { Client } from "pg"

const pgclient = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: "postgres",
  password: "postgres",
  database: "postgres",
})

pgclient.connect()

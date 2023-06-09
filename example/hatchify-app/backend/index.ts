// hatchify-app/backend/index.ts
import Koa from "koa";
import cors from "@koa/cors";
import { hatchifyKoa } from "@hatchifyjs/koa";
import { Todo } from "../schemas/Todo.js";
import { User } from "../schemas/User.js";

const app = new Koa();
const hatchedKoa = hatchifyKoa([Todo, User], {
  prefix: "/api",
  database: {
    dialect: "sqlite",
    storage: "example.sqlite",
  },
});

app.use(cors());
app.use(hatchedKoa.middleware.allModels.all);

(async () => {
  await hatchedKoa.createDatabase();

  app.listen(3000, () => {
    console.log("Started on port 3000");
  });
})();
import { Command } from "commander";
import * as schemas from "../schemas.js";
import {
  getDatabaseConfiguration,
  getHatchFunction,
  setupExpress,
  setupKoa,
} from "./util.js";

const options = new Command()
  .requiredOption("-f, --framework <express|koa>", "Node framework")
  .requiredOption("-d, --database <sqlite|rds|postgres>", "Database type")
  .parse()
  .opts();

const hatchedNode = getHatchFunction(options.framework)(schemas, {
  prefix: "/api",
  database: getDatabaseConfiguration(options.database),
});

(async () => {
  await hatchedNode.modelSync({ alter: true });

  (await setupApp(hatchedNode.middleware.allModels.all)).listen(3000, () => {
    console.log("Started on http://localhost:3000");
  });
})();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function setupApp(middleware: any) {
  if (options.framework === "express") return setupExpress(middleware);
  return setupKoa(middleware);
}

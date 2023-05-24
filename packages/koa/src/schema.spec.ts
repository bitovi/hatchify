import { Scaffold } from "./index";
import Koa from "koa";
import { DataTypes, ScaffoldModel } from "./types";
import { createServer, GET } from "./testing/utils";

describe("Schema Tests", () => {
  const Model: ScaffoldModel = {
    name: "Model",
    attributes: {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
  };

  it("should create fetch the schema for a specific model", async () => {
    const app = new Koa();
    const scaffold = new Scaffold([Model], { prefix: "/api" });
    app.use(async (ctx) => {
      ctx.body = scaffold.schema.Model;
    });

    const server = createServer(app);
    await scaffold.createDatabase();

    const find1 = await GET(server, "/");

    expect(find1).toBeTruthy();
    expect(find1.status).toBe(200);

    await scaffold.orm.close();
  });
});

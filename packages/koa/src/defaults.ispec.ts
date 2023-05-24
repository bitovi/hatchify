/* eslint-disable jest/no-commented-out-tests */
// import { Scaffold, Parse, Serialize } from "./index";
// import Koa from "koa";
// import { DataTypes, ScaffoldModel } from "./types";
// import { createServer, GET, DELETE, POST, PUT } from "./testing/utils";

// describe("Default Tests", () => {
//   const Model: ScaffoldModel = {
//     name: "Model",
//     attributes: {
//       firstName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//       lastName: {
//         type: DataTypes.STRING,
//         allowNull: false,
//       },
//     },
//   };

//   it("should handle global parse behavior", async () => {
//     let err = null;
//     try {
//       await Parse(Model).findAll("fields[model]=badAttribute");
//     } catch (error) {
//       err = error;
//     }

//     expect(err).toBeTruthy();

//     const findOptions1 = await Parse(Model).findAll(
//       "fields[model]=firstName&include=assignments"
//     );
//     expect(findOptions1).toStrictEqual({
//       attributes: ["firstName"],
//       include: ["assignments"],
//       where: {},
//     });
//   });

//   it("should handle global serialize behavior", async () => {
//     const jsonApiResult = await Serialize(Model).findAll([]);
//     expect(jsonApiResult).toBeTruthy();
//   });

//   it("should handle default read all operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();

//     const findall = await GET(server, "/api/models");

//     expect(findall).toBeTruthy();
//     expect(findall.status).toBe(200);
//     expect(findall.deserialized).toHaveProperty("length");
//     expect(findall.deserialized.length).toBe(0);

//     await scaffold.orm.close();
//   });

//   it("should handle default read one not found operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();
//     const find = await GET(server, "/api/models/1");

//     expect(find).toBeTruthy();
//     expect(find.status).toBe(404);
//     expect(find.text).toBe("Not Found");
//     expect(find.deserialized).toBeFalsy();

//     await scaffold.orm.close();
//   });

//   it("should handle default read one after create operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();

//     await POST(server, "/api/models", {
//       firstName: "firstName",
//       lastName: "lastName",
//     });

//     const create = await POST(server, "/api/models", {
//       firstName: "firstName2",
//       lastName: "lastName2",
//     });

//     await POST(server, "/api/models", {
//       firstName: "firstName3",
//       lastName: "lastName3",
//     });

//     expect(create).toBeTruthy();
//     expect(create.status).toBe(200);
//     expect(create.deserialized).toHaveProperty("id");
//     expect(create.deserialized.id).toBeTruthy();

//     const find = await GET(server, "/api/models/" + create.deserialized.id);

//     expect(find).toBeTruthy();
//     expect(find.status).toBe(200);
//     expect(find.deserialized).toBeTruthy();
//     expect(find.deserialized.id).toBe(create.deserialized.id);

//     await scaffold.orm.close();
//   });

//   it("should handle default create operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();

//     const create = await POST(server, "/api/models", {
//       firstName: "firstName",
//       lastName: "lastName",
//     });

//     expect(create).toBeTruthy();
//     expect(create.status).toBe(200);
//     expect(create.deserialized).toHaveProperty("id");

//     const findall = await GET(server, "/api/models");

//     expect(findall).toBeTruthy();
//     expect(findall.status).toBe(200);
//     expect(findall.deserialized).toHaveProperty("length");
//     expect(findall.deserialized.length).toBe(1);

//     await scaffold.orm.close();
//   });

//   it("should handle default update operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();

//     const create = await POST(server, "/api/models", {
//       firstName: "firstName",
//       lastName: "lastName",
//     });
//     expect(create).toBeTruthy();
//     expect(create.status).toBe(200);
//     expect(create.deserialized).toHaveProperty("id");

//     const update = await PUT(server, "/api/models/" + create.deserialized.id, {
//       firstName: "newFirstName",
//       lastName: "newLastName",
//     });
//     expect(update).toBeTruthy();
//     expect(update.status).toBe(200);

//     const findall = await GET(server, "/api/models");

//     expect(findall).toBeTruthy();
//     expect(findall.status).toBe(200);
//     expect(findall.deserialized).toHaveProperty("length");
//     expect(findall.deserialized.length).toBe(1);

//     await scaffold.orm.close();
//   });

//   it("should handle default delete operations", async () => {
//     const app = new Koa();
//     const scaffold = new Scaffold([Model], { prefix: "/api" });
//     app.use(scaffold.middleware.allModels.all);

//     const server = createServer(app);
//     await scaffold.createDatabase();

//     const create = await POST(server, "/api/models", {
//       firstName: "firstName",
//       lastName: "lastName",
//     });
//     expect(create).toBeTruthy();
//     expect(create.status).toBe(200);
//     expect(create.deserialized).toHaveProperty("id");

//     const findall1 = await GET(server, "/api/models");

//     expect(findall1).toBeTruthy();
//     expect(findall1.status).toBe(200);
//     expect(findall1.deserialized).toHaveProperty("length");
//     expect(findall1.deserialized.length).toBe(1);

//     const del = await DELETE(server, "/api/models/" + create.deserialized.id);
//     expect(del).toBeTruthy();
//     expect(del.status).toBe(200);

//     const findall2 = await GET(server, "/api/models");

//     expect(findall2).toBeTruthy();
//     expect(findall2.status).toBe(200);
//     expect(findall2.deserialized).toHaveProperty("length");
//     expect(findall2.deserialized.length).toBe(0);

//     await scaffold.orm.close();
//   });
// });

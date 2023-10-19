// import cors from "@koa/cors"
// import Koa from "koa"
import {
  describe,
  // expect,
  it,
} from "vitest"
// import { string } from "@hatchifyjs/core"
// import { hatchifyKoa } from "@hatchifyjs/koa"
// import hatchifyReactRest from "@hatchifyjs/react-rest"
// import jsonapi from "../rest-client-jsonapi"
// import { testBackendEndpointConfig } from "../setupTests"

// const Article = {
//   name: "Article",
//   type: "Article",
//   displayAttribute: "name",
//   attributes: {
//     author: string({ required: true }),
//     tag: string({ required: true }),
//   },
// }

// const Feature_Article = {
//   name: "Article",
//   type: "Feature_Article",
//   namespace: "Feature",
//   displayAttribute: "name",
//   attributes: {
//     author: string({ required: true }),
//     tag: string({ required: true }),
//   },
// }

// todo: arthur fix when more v2 types implemented
describe("Testing CRUD operations against Hatchify backend", async () => {
  it.skip("successfully runs CRUD operations", async () => {
    // const app = new Koa()
    // const hatchedKoa = hatchifyKoa(
    //   { Article },
    //   {
    //     prefix: `/${testBackendEndpointConfig.api}`,
    //     database: {
    //       dialect: "sqlite",
    //       storage: ":memory:",
    //       logging: false,
    //     },
    //   },
    // )
    // app.use(cors())
    // app.use(hatchedKoa.middleware.allModels.all)
    // await hatchedKoa.createDatabase()
    // const server = app.listen(3010) // TODO determine why unique port numbers are needed across tests in this file (otherwise, tests are liable to fail): https://bitovi.atlassian.net/browse/HATCH-415
    // const jsonApi = jsonapi(
    //   `http://localhost:3010/${testBackendEndpointConfig.api}`,
    //   {
    //     Article: {
    //       ...Article,
    //       endpoint: `${testBackendEndpointConfig.schemaSegment}`,
    //     },
    //   },
    // )
    // const hatchedReactRest = hatchifyReactRest(jsonApi)
    // await hatchedReactRest.Article.createOne({
    //   attributes: {
    //     author: "John Doe",
    //     tag: "Hatchify",
    //   },
    // })
    // const [articles] = await hatchedReactRest.Article.findAll({})
    // const [article] = articles
    // const { id } = article
    // expect(articles.length === 1)
    // expect(article).toEqual({
    //   id,
    //   __schema: "Article",
    //   author: "John Doe",
    //   tag: "Hatchify",
    // })
    // await hatchedReactRest.Article.updateOne({
    //   id,
    //   attributes: {
    //     author: "John Doe Updated",
    //     tag: "Hatchify Updated",
    //   },
    // })
    // const updatedArticleQuery = await hatchedReactRest.Article.findOne(id)
    // expect(updatedArticleQuery).toEqual({
    //   id,
    //   __schema: "Article",
    //   author: "John Doe Updated",
    //   tag: "Hatchify Updated",
    // })
    // await hatchedReactRest.Article.deleteOne(id)
    // await expect(() => hatchedReactRest.Article.findOne(id)).rejects.toThrow()
    // expect.assertions(4) // Useful for confirming that assertions were actually called against asynchronous functions
    // server.close()
  })

  // Note: This test does not spin up a Postgres server on its own. You must have one running locally in order for this test to pass.
  it.skip("successfully runs CRUD operations on schemas with namespaces", async () => {
    // const app = new Koa()
    // const hatchedKoa = hatchifyKoa(
    //   { Feature_Article },
    //   {
    //     prefix: `/${testBackendEndpointConfig.api}`,
    //     database: {
    //       dialect: "postgres",
    //       host: process.env.PG_DB_HOST,
    //       port: Number(process.env.PG_DB_PORT),
    //       username: process.env.PG_DB_USERNAME,
    //       password: process.env.PG_DB_PASSWORD,
    //       database: process.env.PG_DB_NAME,
    //       logging: false,
    //     },
    //   },
    // )
    // app.use(cors())
    // app.use(hatchedKoa.middleware.allModels.all)
    // await hatchedKoa.createDatabase()
    // const server = app.listen(3011) // TODO determine why unique port numbers are needed across tests in this file (otherwise, tests are liable to fail): https://bitovi.atlassian.net/browse/HATCH-415
    // const jsonApi = jsonapi(
    //   `http://localhost:3011/${testBackendEndpointConfig.api}`,
    //   {
    //     Feature_Article: {
    //       ...Feature_Article,
    //       endpoint: `${testBackendEndpointConfig.namespacedSchemaSegment}`,
    //     },
    //   },
    // )
    // const hatchedReactRest = hatchifyReactRest(jsonApi)
    // await hatchedReactRest.Feature_Article.createOne({
    //   attributes: {
    //     author: "John Doe",
    //     tag: "Hatchify",
    //   },
    // })
    // const [featureArticles] = await hatchedReactRest.Feature_Article.findAll({})
    // const [featureArticle] = featureArticles
    // const { id } = featureArticle
    // expect(featureArticles.length === 1)
    // expect(featureArticle).toEqual({
    //   id,
    //   __schema: "Feature_Article",
    //   author: "John Doe",
    //   tag: "Hatchify",
    // })
    // await hatchedReactRest.Feature_Article.updateOne({
    //   id,
    //   attributes: {
    //     author: "John Doe Updated",
    //     tag: "Hatchify Updated",
    //   },
    // })
    // const updatedFeatureArticleQuery =
    //   await hatchedReactRest.Feature_Article.findOne(id)
    // expect(updatedFeatureArticleQuery).toEqual({
    //   id,
    //   __schema: "Feature_Article",
    //   author: "John Doe Updated",
    //   tag: "Hatchify Updated",
    // })
    // await hatchedReactRest.Feature_Article.deleteOne(id)
    // await expect(() =>
    //   hatchedReactRest.Feature_Article.findOne(id),
    // ).rejects.toThrow()
    // expect.assertions(4) // Useful for confirming that assertions were actually called against asynchronous functions
    // server.close()
  })
})

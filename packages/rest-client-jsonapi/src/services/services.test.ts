import Koa from "koa"
import { describe, expect, it } from "vitest"
import type { PartialSchema } from "@hatchifyjs/core"
import { belongsTo, hasMany, string } from "@hatchifyjs/core"
import { hatchifyKoa } from "@hatchifyjs/koa"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import jsonapi from "../rest-client-jsonapi"
import { testBackendEndpointConfig } from "../setupTests"

const Article = {
  name: "Article",
  ui: { displayAttribute: "author" },
  attributes: {
    author: string({ required: true }),
    tag: string({ required: true }),
  },
} satisfies PartialSchema

const Feature_Article = {
  name: "Article",
  namespace: "Feature",
  ui: { displayAttribute: "author" },
  attributes: {
    author: string({ required: true }),
    tag: string({ required: true }),
  },
  relationships: {
    admin_user: belongsTo("Admin_User"),
  },
} satisfies PartialSchema

const Admin_User = {
  name: "User",
  namespace: "Admin",
  attributes: {
    name: string(),
  },
  relationships: {
    articles: hasMany("Feature_Article"),
  },
} satisfies PartialSchema

// todo: arthur fix when more v2 types implemented
describe("Testing CRUD operations against Hatchify backend", async () => {
  it("successfully runs CRUD operations", async () => {
    const app = new Koa()
    const hatchedKoa = hatchifyKoa(
      { Article },
      { prefix: `/${testBackendEndpointConfig.api}` },
    )
    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.modelSync({ alter: true })
    const server = app.listen(3010) // TODO determine why unique port numbers are needed across tests in this file (otherwise, tests are liable to fail): https://bitovi.atlassian.net/browse/HATCH-415

    const jsonApi = jsonapi(
      `http://localhost:3010/${testBackendEndpointConfig.api}`,
      {
        Article: {
          ...Article,
          endpoint: `${testBackendEndpointConfig.schemaSegment}`,
        },
      },
    )

    const hatchedReactRest = hatchifyReactRest(jsonApi)

    await hatchedReactRest.Article.createOne({
      author: "John Doe",
      tag: "Hatchify",
    })

    const [articles] = await hatchedReactRest.Article.findAll({})
    const [article] = articles
    const { id } = article

    expect(articles.length === 1)

    expect(article).toEqual({
      id,
      __schema: "Article",
      author: "John Doe",
      tag: "Hatchify",
    })

    await hatchedReactRest.Article.updateOne({
      id,

      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })

    const updatedArticleQuery = await hatchedReactRest.Article.findOne(id)
    expect(updatedArticleQuery).toEqual({
      id,
      __schema: "Article",
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })

    await hatchedReactRest.Article.deleteOne(id)
    await expect(() => hatchedReactRest.Article.findOne(id)).rejects.toThrow()

    expect.assertions(4) // Useful for confirming that assertions were actually called against asynchronous functions
    server.close()
  })

  // Note: This test does not spin up a Postgres server on its own. You must have one running locally in order for this test to pass.
  it("successfully runs CRUD operations on schemas with namespaces", async () => {
    const app = new Koa()
    const hatchedKoa = hatchifyKoa(
      { Feature_Article, Admin_User },
      {
        prefix: `/${testBackendEndpointConfig.api}`,
        database: {
          uri: process.env.DB_URI,
        },
      },
    )
    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.modelSync({ alter: true })
    const server = app.listen(3011) // TODO determine why unique port numbers are needed across tests in this file (otherwise, tests are liable to fail): https://bitovi.atlassian.net/browse/HATCH-415
    const jsonApi = jsonapi(
      `http://localhost:3011/${testBackendEndpointConfig.api}`,
      {
        Feature_Article: {
          ...Feature_Article,
          endpoint: `${testBackendEndpointConfig.namespacedSchemaSegment}`,
        },
        Admin_User: {
          ...Admin_User,
          endpoint: `${testBackendEndpointConfig.adminUserNamespaceSegment}`,
        },
      },
    )
    const hatchedReactRest = hatchifyReactRest(jsonApi)

    await hatchedReactRest.Feature_Article.createOne({
      author: "John Doe",
      tag: "Hatchify",
    })

    const [featureArticles] = await hatchedReactRest.Feature_Article.findAll({})
    const [featureArticle] = featureArticles
    const { id } = featureArticle
    expect(featureArticles.length === 1)
    expect(featureArticle).toEqual({
      id,
      __schema: "Feature_Article",
      admin_UserId: null,
      admin_userId: null,
      author: "John Doe",
      tag: "Hatchify",
    })
    await hatchedReactRest.Feature_Article.updateOne({
      id,
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })
    const updatedFeatureArticleQuery =
      await hatchedReactRest.Feature_Article.findOne(id)
    expect(updatedFeatureArticleQuery).toEqual({
      id,
      __schema: "Feature_Article",
      admin_UserId: null,
      admin_userId: null,
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })
    await hatchedReactRest.Feature_Article.deleteOne(id)
    await expect(() =>
      hatchedReactRest.Feature_Article.findOne(id),
    ).rejects.toThrow()
    expect.assertions(4) // Useful for confirming that assertions were actually called against asynchronous functions
    server.close()
  })

  // Note: This test does not spin up a Postgres server on its own. You must have one running locally in order for this test to pass.
  it("successfully runs CRUD operations on schemas with different namespaces", async () => {
    const app = new Koa()

    const hatchedKoa = hatchifyKoa(
      { Feature_Article, Admin_User },
      {
        prefix: `/${testBackendEndpointConfig.api}`,
        database: {
          uri: process.env.DB_URI,
        },
      },
    )
    app.use(hatchedKoa.middleware.allModels.all)
    await hatchedKoa.modelSync({ alter: true })
    const server = app.listen(3012) // TODO determine why unique port numbers are needed across tests in this file (otherwise, tests are liable to fail): https://bitovi.atlassian.net/browse/HATCH-415
    const jsonApi = jsonapi(
      `http://localhost:3012/${testBackendEndpointConfig.api}`,
      {
        Feature_Article: {
          ...Feature_Article,
          endpoint: `${testBackendEndpointConfig.namespacedSchemaSegment}`,
        },
        Admin_User: {
          ...Admin_User,
          endpoint: `${testBackendEndpointConfig.adminUserNamespaceSegment}`,
        },
      },
    )
    const hatchedReactRest = hatchifyReactRest(jsonApi)

    await hatchedReactRest.Admin_User.createOne({
      name: "Juno",
    })

    await hatchedReactRest.Feature_Article.createOne({
      author: "John Doe",
      tag: "Hatchify",
    })

    const [adminUsers] = await hatchedReactRest.Admin_User.findAll({})
    const [adminUser] = adminUsers
    const { id: userId } = adminUser
    expect(adminUsers.length === 1)

    expect(adminUser).toEqual({
      id: userId,
      __schema: "Admin_User",
      name: "Juno",
    })

    const [featureArticles] = await hatchedReactRest.Feature_Article.findAll({})
    const [featureArticle] = featureArticles
    const { id: articleId } = featureArticle
    expect(featureArticles.length === 1)

    expect(featureArticle).toEqual({
      id: articleId,
      __schema: "Feature_Article",
      admin_UserId: null,
      admin_userId: null,
      author: "John Doe",
      tag: "Hatchify",
    })

    await hatchedReactRest.Admin_User.updateOne({
      id: userId,
      name: "Juno Updated",
      articles: [{ id: articleId }],
    })
    const updatedAdminUserQuery = await hatchedReactRest.Admin_User.findOne({
      id: userId,
      include: ["articles"],
    })

    expect(updatedAdminUserQuery).toEqual({
      id: userId,
      name: "Juno Updated",
      __schema: "Admin_User",
      articles: [
        {
          id: articleId,
          __schema: "Feature_Article",
          __label: "John Doe",
          author: "John Doe",
          tag: "Hatchify",
          admin_userId: null,
          admin_UserId: userId,
        },
      ],
    })

    await hatchedReactRest.Feature_Article.updateOne({
      id: articleId,
      author: "John Doe Updated",
      tag: "Hatchify Updated",
      admin_user: {
        id: userId,
      },
    })

    const updatedFeatureArticleQuery =
      await hatchedReactRest.Feature_Article.findOne({
        id: articleId,
        include: ["admin_user"],
      })

    expect(updatedFeatureArticleQuery).toEqual({
      id: articleId,
      __schema: "Feature_Article",
      admin_UserId: userId,
      admin_user: {
        __label: "Juno Updated",
        __schema: "Admin_User",
        id: userId,
        name: "Juno Updated",
      },
      admin_userId: userId,
      author: "John Doe Updated",
      tag: "Hatchify Updated",
    })
    await hatchedReactRest.Feature_Article.deleteOne(articleId)
    await hatchedReactRest.Admin_User.deleteOne(userId)
    await expect(() =>
      hatchedReactRest.Feature_Article.findOne(articleId),
    ).rejects.toThrow()
    expect.assertions(7) // Useful for confirming that assertions were actually called against asynchronous functions
    server.close()
  })
})

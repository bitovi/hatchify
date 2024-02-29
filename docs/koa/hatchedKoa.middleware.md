## hatchedKoa.middleware

`hatchedKoa.middleware.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`

All of the `middleware` functions export a Koa Middleware that can be passed directly to a Koa app.use or a Koa router.[verb] function, mounted to a specific URL/path. The normal [schemaName] export expects to be used with:

- findAll
- findOne
- findAndCountAll
- create
- update
- destroy

Usage Examples:

```ts
router.get("/get-all-skills", hatchedKoa.middleware.Todo.findAll)
router.get("/count-all-skills", hatchedKoa.middleware.Todo.findAndCountAll)
router.get("/get-one-skill/:id", hatchedKoa.middleware.Todo.findOne)
```

`hatchedKoa.middleware.allModels.all`

This exports a single middleware function that based on the method and the URL will call the right `everything` function. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedKoa.middleware.allModels.all)
```

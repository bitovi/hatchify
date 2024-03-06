# hatchedKoa.middleware

## hatchedKoa.middleware.allModels

`hatchedKoa.middleware.allModels.[all|findAll|findOne|findAndCountAll|create|update|destroy]`

### all

`hatchedKoa.middleware.allModels.all`

This exports a single middleware function that based on the method and the URL will call the right `everything` function. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedKoa.middleware.allModels.all)
```

### findAll

`hatchedKoa.middleware.allModels.findAll`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].findAll` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.findAll)
```

### findAndCountAll

`hatchedKoa.middleware.allModels.findAndCountAll`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].findAndCountAll` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.findAndCountAll)
```

### findOne

`hatchedKoa.middleware.allModels.findOne`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].findOne` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.findOne)
```

### create

`hatchedKoa.middleware.allModels.create`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].create` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.create)
```

### update

`hatchedKoa.middleware.allModels.update`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].update` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.update)
```

### destroy

`hatchedKoa.middleware.allModels.destroy`

This exports a single middleware function that based on the URL will call the right `everything[schemaName].destroy` function regardless of the method.

```ts
app.use(hatchedKoa.middleware.allModels.destroy)
```

## hatchedKoa.middleware[schemaName]

`hatchedKoa.middleware[schemaName].[all|findAll|findOne|findAndCountAll|create|update|destroy]`

All of the `middleware` functions export a Koa Middleware that can be passed directly to a Koa app.use or a Koa router.[verb] function, mounted to a specific URL/path. The normal [schemaName] export expects to be used with:

### all

`hatchedKoa.middleware[schemaName].all`

This exports a single middleware function that based on the method and the URL will call the right `everything` function for a specific schema. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedKoa.middleware[schemaName].all)
```

### findAll

`hatchedKoa.middleware[schemaName].findAll`

This exports a single middleware function that will call `everything[schemaName].findAll` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.get("/get-all-skills", hatchedKoa.middleware.Todo.findAll)
```

### findAndCountAll

`hatchedKoa.middleware[schemaName].findAndCountAll`

This exports a single middleware function that will call `everything[schemaName].findAndCountAll` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.get("/get-and-count-all-skills", hatchedKoa.middleware.Todo.findAndCountAll)
```

### findOne

`hatchedKoa.middleware[schemaName].findOne`

This exports a single middleware function that will call `everything[schemaName].findOne` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.get("/get-one-skill/:id", hatchedKoa.middleware.Todo.findOne)
```

### create

`hatchedKoa.middleware[schemaName].create`

This exports a single middleware function that will call `everything[schemaName].create` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.post("/create-skill", hatchedKoa.middleware.Todo.create)
```

### update

`hatchedKoa.middleware[schemaName].update`

This exports a single middleware function that will call `everything[schemaName].update` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.patch("/update-skill", hatchedKoa.middleware.Todo.update)
```

### destroy

`hatchedKoa.middleware[schemaName].destroy`

This exports a single middleware function that will call `everything[schemaName].destroy` function regardless of the method and the URL. It is useful when used with a router.

```ts
router.delete("/delete-skill", hatchedKoa.middleware.Todo.destroy)
```

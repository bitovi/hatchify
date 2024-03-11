# hatchedExpress.middleware

## hatchedExpress.middleware.allModels

`hatchedExpress.middleware.allModels.[all|findAll|findOne|findAndCountAll|create|update|destroy]`

### all

`hatchedExpress.middleware.allModels.all`

A middleware that calls the right `everything` function for all `GET`/`POST`/`PATCH`/`DELETE` requests. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedExpress.middleware.allModels.all)
```

### findAll

`hatchedExpress.middleware.allModels.findAll`

A middleware that calls the right `everything[schemaName].findAll` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.findAll)
```

### findAndCountAll

`hatchedExpress.middleware.allModels.findAndCountAll`

A middleware that calls the right `everything[schemaName].findAndCountAll` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.findAndCountAll)
```

### findOne

`hatchedExpress.middleware.allModels.findOne`

A middleware that calls the right `everything[schemaName].findOne` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.findOne)
```

### create

`hatchedExpress.middleware.allModels.create`

A middleware that calls the right `everything[schemaName].findAll` for POST requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.create)
```

### update

`hatchedExpress.middleware.allModels.update`

A middleware that calls the right `everything[schemaName].findAll` for PATCH requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.update)
```

### destroy

`hatchedExpress.middleware.allModels.destroy`

A middleware that calls the right `everything[schemaName].findAll` for DELETE requests to `/[schemaName]`.

```ts
app.use(hatchedExpress.middleware.allModels.destroy)
```

## hatchedExpress.middleware[schemaName]

`hatchedExpress.middleware[schemaName].[all|findAll|findOne|findAndCountAll|create|update|destroy]`

All of the `middleware` functions export a Express Middleware that can be passed directly to a Express `app.use`. The normal [schemaName] export expects to be used with:

### all

`hatchedExpress.middleware[schemaName].all`

A middleware that calls the right `everything` function for `GET`/`POST`/`PATCH`/`DELETE` to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.all)
```

### findAll

`hatchedExpress.middleware[schemaName].findAll`

A middleware that calls `everything.Todo.findAll` for GET requests to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.findAll)
```

### findAndCountAll

`hatchedExpress.middleware[schemaName].findAndCountAll`

A middleware that calls `everything.Todo.findAndCountAll` for GET requests to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.findAndCountAll)
```

### findOne

`hatchedExpress.middleware[schemaName].findOne`

A middleware that calls `everything.Todo.findOne` for GET requests to `/[schemaName]/:id`.

```ts
app.use(hatchedExpress.middleware.Todo.findOne)
```

### create

`hatchedExpress.middleware[schemaName].create`

A middleware that calls `everything.Todo.create` for POST requests to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.create)
```

### update

`hatchedExpress.middleware[schemaName].update`

A middleware that calls `everything.Todo.update` for PATCH requests to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.update)
```

### destroy

`hatchedExpress.middleware[schemaName].destroy`

A middleware that calls `everything.Todo.findAll` for DELETE requests to `/todos`.

```ts
app.use(hatchedExpress.middleware.Todo.destroy)
```

# hatchedKoa.middleware

## hatchedKoa.middleware.allModels

`hatchedKoa.middleware.allModels.[all|findAll|findOne|findAndCountAll|create|update|destroy]`

### all

`hatchedKoa.middleware.allModels.all`

A middleware that calls the right `everything` function for all `GET`/`POST`/`PATCH`/`DELETE` requests. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedKoa.middleware.allModels.all)
```

### findAll

`hatchedKoa.middleware.allModels.findAll`

A middleware that calls the right `everything[schemaName].findAll` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.findAll)
```

### findAndCountAll

`hatchedKoa.middleware.allModels.findAndCountAll`

A middleware that calls the right `everything[schemaName].findAndCountAll` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.findAndCountAll)
```

### findOne

`hatchedKoa.middleware.allModels.findOne`

A middleware that calls the right `everything[schemaName].findOne` for GET requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.findOne)
```

### create

`hatchedKoa.middleware.allModels.create`

A middleware that calls the right `everything[schemaName].findAll` for POST requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.create)
```

### update

`hatchedKoa.middleware.allModels.update`

A middleware that calls the right `everything[schemaName].findAll` for PATCH requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.update)
```

### destroy

`hatchedKoa.middleware.allModels.destroy`

A middleware that calls the right `everything[schemaName].findAll` for DELETE requests to `/[schemaName]`.

```ts
app.use(hatchedKoa.middleware.allModels.destroy)
```

## hatchedKoa.middleware[schemaName]

`hatchedKoa.middleware[schemaName].[all|findAll|findOne|findAndCountAll|create|update|destroy]`

All of the `middleware` functions export a Koa Middleware that can be passed directly to a Koa `app.use`. The normal [schemaName] export expects to be used with:

### all

`hatchedKoa.middleware[schemaName].all`

A middleware that calls the right `everything` function for `GET`/`POST`/`PATCH`/`DELETE` to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.all)
```

### findAll

`hatchedKoa.middleware[schemaName].findAll`

A middleware that calls `everything.Todo.findAll` for GET requests to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.findAll)
```

### findAndCountAll

`hatchedKoa.middleware[schemaName].findAndCountAll`

A middleware that calls `everything.Todo.findAndCountAll` for GET requests to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.findAndCountAll)
```

### findOne

`hatchedKoa.middleware[schemaName].findOne`

A middleware that calls `everything.Todo.findOne` for GET requests to `/[schemaName]/:id`.

```ts
app.use(hatchedKoa.middleware.Todo.findOne)
```

### create

`hatchedKoa.middleware[schemaName].create`

A middleware that calls `everything.Todo.create` for POST requests to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.create)
```

### update

`hatchedKoa.middleware[schemaName].update`

A middleware that calls `everything.Todo.update` for PATCH requests to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.update)
```

### destroy

`hatchedKoa.middleware[schemaName].destroy`

A middleware that calls `everything.Todo.findAll` for DELETE requests to `/todos`.

```ts
app.use(hatchedKoa.middleware.Todo.destroy)
```

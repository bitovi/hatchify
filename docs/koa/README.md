# `@hatchifyjs/koa`

`@hatchifyjs/koa` is an [NPM package](https://www.npmjs.com/package/@hatchifyjs/koa) that takes a [Schema](../schema/README.md) and produces:

- [Sequelize](https://sequelize.org/) models,
- an expressive [JSON:API](../jsonapi/README.md) restful middleware, and
- utilities for building custom restful endpoints.

The following uses `hatchifyKoa` to create `POST`, `GET`, `PATCH`, and `DELETE` endpoints at `/api/todos`.

```ts
import { hatchifyKoa } from "@hatchifyjs/koa"
import { datetime, string, PartialSchema } from "@hatchifyjs/core"
import Koa from "koa"

// Define the schema
const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
    },
  },
} satisfies Record<string, PartialSchema>

const app = new Koa()

// Pass schemas and other settings to configure hatchify
const hatchedKoa = hatchifyKoa(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})

;(async () => {
  // Update the database to match the schema
  await hatchedKoa.modelSync({ alter: true })

  // Create CRUD endpoints for all schemas
  app.use(hatchedKoa.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

- [Exports](#exports)
  - [hatchifyKoa](#hatchifykoa) - Creates a `hatchedKoa` instance with middleware and sequelize orms
  - [HatchifyKoa](#hatchifykoa-1) - A type for TypeScript usage
  - [errorHandlerMiddleware](#errorhandlermiddleware) - An error handle that produces JSONAPI formatted errors
- [`hatchedKoa`](#hatchedkoa) -
  - [`hatchedKoa.everything[schemaName]`](#hatchedkoaeverythingschemaname)
  - [`hatchedKoa.middleware[schemaName|allModels]`](#hatchedkoamiddlewareschemanameallmodels)
  - [`hatchedKoa.modelSync`](#hatchedkoamodelsync)
  - [`hatchedKoa.orm`](#hatchedkoaorm)
  - [`hatchedKoa.parse[schemaName]`](#hatchedkoaparseschemaname)
  - [`hatchedKoa.printEndpoints`](#hatchedkoaprintendpoints)
  - [`hatchedKoa.schema[schemaName]`](#hatchedkoaschemaschemaname)
  - [`hatchedKoa.serialize[schemaName]`](#hatchedkoaserializeschemaname)

## Exports

`@hatchifyjs/koa` provides three named exports:

- hatchifyKoa - Creates a `hatchedKoa` instance with middleware and [Sequelize](https://sequelize.org/) ORM
- HatchifyKoa - A type for TypeScript fans
- errorHandlerMiddleware - A middleware to catch any Hatchify error and transform it to a proper [JSON:API](../jsonapi/README.md) response

```ts
import { hatchifyKoa, HatchifyKoa, errorHandlerMiddleware } from "@hatchifyjs/koa"
```

### hatchifyKoa

`hatchifyKoa(schemas: Schemas, options: KoaOptions)` is a `Function` that constructs a `hatchedKoa` instance with middleware and [Sequelize](https://sequelize.org/) ORM:

```ts
import { hatchifyKoa } from "@hatchifyjs/koa";

const schemas = { ... }

const app = new Koa()

const hatchedKoa = hatchifyKoa(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})
```

**Parameters**

`hatchifyKoa` takes two arguments `schemas` and `options`.

`schema` is a collection of [Hatchify Schemas](../schema/README.md).

`options` is an object with the following key / values:

| Property          | Type                                   | Default                    | Details                                                                                                                                           |
| ----------------- | -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| uri               | string                                 | sqlite://localhost/:memory | The database URI / connection string of the relational database. Ex. `postgres://user:password@host:port/database?ssl=true`                       |
| logging           | (sql: string, timing?: number) => void | undefined                  | A function that gets executed every time Sequelize would log something.                                                                           |
| additionalOptions | object                                 | undefined                  | An object of additional options, which are passed directly to the underlying connection library (example: [pg](https://www.npmjs.com/package/pg)) |

See [Using Postgres](../guides/using-postgres-db.md) for instructions on how to set up HatchifyJS with postgres.

**Returns**

Returns a [HatchifyKoa] instance which is documented below.

### HatchifyKoa

`HatchifyKoa` is the constructor function used to create a [hatchedKoa] instance. This TypeScript type typically isn't used directly (it's exported to support implicit typing of the return from the `hatchifyKoa` constructor); however, it can be useful when defining a custom type that may reference `hatchedKoa`.

```ts
import type { HatchifyKoa from "@hatchifyjs/koa"
import { hatchifyKoa } from "@hatchifyjs/koa"

type Globals = {
  hatchedKoa: HatchifyKoa
}

const globals : Globals = {
  hatchedKoa: hatchifyKoa(schemas, options);
}
```

### errorHandlerMiddleware

`errorHandlerMiddleware` is a middleware to catch any Hatchify error and transform it to a proper [JSON:API](../jsonapi/README.md) response:

```ts
import { errorHandlerMiddleware } from "@hatchifyjs/koa"

app.use(errorHandlerMiddleware)
app.use(() => {
  throw [new NotFoundError({ detail: "Fake error" })]
})
```

so any request will throw and handled to return an error similar to

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "status": 404,
      "code": "not-found",
      "detail": "Fake error",
      "title": "Resource not found."
    }
  ]
}
```

## hatchedKoa

`hatchedKoa` is an instance of [`HatchifyKoa`] that is returned by the [`hatchifyKoa`] function. It provides:

- [Sequelize](https://sequelize.org/) orm models,
- an expressive [JSON:API](../jsonapi/README.md) restful middleware, and
- utilities for building custom restful endpoints.

The following show some of the methods available given a `Todo` and `User` schema:

<pre>
import { hatchifyKoa } from "@hatchifyjs/koa";

const hatchedKoa = hatchifyKoa({SalesPerson: {...}, {prefix: "/api"})

hatchedKoa.<a href="schema/README.md">schema</a>.SalesPerson  <b>// The full schemas</b>
hatchedKoa.modelSync()         <b>// Sync the database with the schema</b>
hatchedKoa.printEndpoints()    <b>// Prints a list of endpoints generated by Hatchify</b>

<b>// JSONAPI Middleware for CRUD operations</b>
app.use(hatchedKoa.middleware.<a href="./koa/hatchedKoa.middleware.md#hatchedkoamiddlewareallmodels">allModels</a>.<a href="./koa/hatchedKoa.middleware.md#all">all</a>);
app.use(hatchedKoa.middleware.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#findandcountall">findAndCountAll</a>)
app.use(hatchedKoa.middleware.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#findone">findOne</a>)
app.use(hatchedKoa.middleware.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#create">create</a>)
app.use(hatchedKoa.middleware.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#update">update</a>)
app.use(hatchedKoa.middleware.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#destroy">destroy</a>)

<b>// JSONAPI Handler for CRUD operations</b>
router.all(  "/sales-people",     hatchedKoa.handler.<a href="./koa/hatchedKoa.middleware.md#hatchedkoamiddlewareallmodels">allModels</a>.<a href="./koa/hatchedKoa.middleware.md#all">all</a>);
router.get(  "/sales-people",     hatchedKoa.handler.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#findandcountall">findAndCountAll</a>)
router.get(  "/sales-people/:id", hatchedKoa.handler.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#findone">findOne</a>)
router.post( "/sales-people",     hatchedKoa.handler.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#create">create</a>)
router.patch("/sales-people/:id", hatchedKoa.handler.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#update">update</a>)
router.del(  "/sales-people/:id", hatchedKoa.handler.SalesPerson.<a href="./koa/hatchedKoa.middleware.md#destroy">destroy</a>)

<b>// Methods that do "everything" the middleware does</b>
await hatchedKoa.<a href="./hatchedKoa.everything.md">everything</a>.SalesPerson.<a href="./hatchedKoa.everything.md#findall">findAll</a>("filter[name]=Jane")
await hatchedKoa.everything.SalesPerson.<a href="./hatchedKoa.everything.md#findandcountall">findAndCountAll</a>("filter[name]=Baking")
await hatchedKoa.everything.SalesPerson.<a href="./hatchedKoa.everything.md#findOne">findOne</a>("filter[name]=Baking")
await hatchedKoa.everything.SalesPerson.<a href="./hatchedKoa.everything.md#create">create</a>(JSONAPI_PAYLOAD)
await hatchedKoa.everything.SalesPerson.<a href="./hatchedKoa.everything.md#update">update</a>(JSONAPI_PARTIAL_PAYLOAD, UUID)
await hatchedKoa.everything.SalesPerson.<a href="./hatchedKoa.everything.md#destroy">destroy</a>(UUID)

<b>// Parse JSONAPI requests into arguments for sequelize</b>
hatchedKoa.<a href="./hatchedKoa.parse.md">parse</a>.SalesPerson.<a href="./hatchedKoa.parse.md#findall">findAll</a>("filter[name]=Jane")
hatchedKoa.parse.SalesPerson.<a href="./hatchedKoa.parse.md#findandcountall">findAndCountAll</a>("filter[name]=Baking")
hatchedKoa.parse.SalesPerson.<a href="./hatchedKoa.parse.md#findOne">findOne</a>("filter[name]=Baking")
hatchedKoa.parse.SalesPerson.<a href="./hatchedKoa.parse.md#create">create</a>(JSONAPI_PAYLOAD)
hatchedKoa.parse.SalesPerson.<a href="./hatchedKoa.parse.md#update">update</a>(JSONAPI_PARTIAL_PAYLOAD, UUID)
hatchedKoa.parse.SalesPerson.<a href="./hatchedKoa.parse.md#destroy">destroy</a>(UUID)

<b>// Use the underlying sequelize methods</b>
await hatchedKoa.<a href="https://sequelize.org/docs/v6/core-concepts/model-basics/#model-definition">orm</a>.models.SalesPerson.<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#specifying-attributes-for-select-queries">findAll</a>({where: {name: "Jane"}})
await hatchedKoa.orm.models.SalesPerson.<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-insert-queries">create</a>({name: "Justin"})
await hatchedKoa.orm.models.SalesPerson.<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-update-queries">update</a>({name: "Roye"},{where: {id: UUID}})
await hatchedKoa.orm.models.SalesPerson.<a href="https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#simple-delete-queries">destroy</a>({where: {id: UUID}})

<b>// Serialize sequelize data back to JSONAPI responses</b>
hatchedKoa.<a href="./hatchedKoa.parse.md">serialize</a>.SalesPerson.<a href="./hatchedKoa.serialize.md#findall">findAll</a>([{ id: UUID, name: "Roye" }])
hatchedKoa.serialize.SalesPerson.<a href="./hatchedKoa.serialize.md#findandcountall">findAndCountAll</a>({rows: [{id: UUID, ...}], count: 1})
hatchedKoa.serialize.SalesPerson.<a href="./hatchedKoa.serialize.md#findOne">findOne</a>({ id: UUID, name: "Roye" })
hatchedKoa.serialize.SalesPerson.<a href="./hatchedKoa.serialize.md#create">create</a>({ id: UUID, name: "Roye" })
hatchedKoa.serialize.SalesPerson.<a href="./hatchedKoa.serialize.md#update">update</a>({ id: UUID, name: "Roye" }, 1)
hatchedKoa.serialize.SalesPerson.<a href="./hatchedKoa.serialize.md#destroy">destroy</a>()
</pre>

### `hatchedKoa.everything[schemaName]`

[hatchedKoa.everything](./hatchedKoa.everything.md) functions very similar to the `middleware` export but is expected to be used more directly, usually when defining user-created middleware.

The `everything` functions takes the same properties as `parse` but goes further than just building the query options. This function will do a complete operation of parsing the request, performing the ORM query operation and then serializing the resulting data to JSON:API format.

For example `hatchedKoa.everything.Todo.findAll` takes the URL query params and directly returns JSON:API ready response data.

```ts
router.get("/todos", async (ctx: Context) => {
  const serializedTodos = await hatchedKoa.everything.Todo.findAll(ctx.query)
  ctx.body = serializedTodos
})
```

### hatchedKoa.middleware[schemaName|allModels]

[`hatchedKoa.middleware[schemaName][findAll|findOne|findAndCountAll|create|update|destroy]`](./hatchedKoa.middleware.md)

All of the `middleware` functions export a Koa Middleware that can be passed directly to a Koa `app.use` or a Koa `router[verb]` function, mounted to a specific URL/path. The normal [schemaName] export expects to be used with:

- findAll
- findOne
- findAndCountAll
- create
- update
- destroy

### hatchedKoa.modelSync

A utility function to make sure your schemas are always synced with the database.

[Read more on Model Sync](../guides/model-sync.md)

### hatchedKoa.orm

A reference to the `Sequelize` instance when more control is needed.

```ts
hatchedKoa.orm.models.Todo.findAll()
```

### hatchedKoa.parse[schemaName]

[hatchedKoa.parse[schemaName]](./hatchedKoa.parse.md) has methods to parse a [JSON:API](../jsonapi/README.md) request and return options that can be passed to the [models](#hatchedkoaorm) to CRUD data.

### hatchedKoa.printEndpoints

Prints a list of endpoints generated by Hatchify. This can be useful for debugging 404 errors.

Example output:

```bash
Hatchify endpoints:
GET    /api/todos
POST   /api/todos
GET    /api/todos/:id
PATCH  /api/todos/:id
DELETE /api/todos/:id
GET    /api/users
POST   /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id
```

Usage Examples:

```ts
router.get("/get-all-todos", hatchedKoa.middleware.Todo.findAll)
router.get("/get-and-count-all-todos", hatchedKoa.middleware.Todo.findAndCountAll)
router.get("/get-one-todo/:id", hatchedKoa.middleware.Todo.findOne)
```

`hatchedKoa.middleware.allModels.all`

This exports a single middleware function that based on the method and the URL will call the right `everything` function. It is useful as a default handler to handle all Hatchify `GET`/`POST`/`PATCH`/`DELETE` endpoints.

```ts
app.use(hatchedKoa.middleware.allModels.all)
```

### hatchedKoa.schema[schemaName]

`hatchedKoa.schema[schemaName][attributes|displayAttribute|name|namespace|pluralName|relationships]`

The `schema` export provides access to all the Hatchify final schemas. This can be useful for debugging the schemas you provided.

```ts
console.log(hatchedKoa.schema)
// {
//   Todo: {
//     name: "Todo",
//     namespace: "Admin",
//     pluralName: "Todos",
//     attributes: { ... },
//     relationships: {
//       user: { ... }
//     }
//   },
//   ...
// }
```

### `hatchedKoa.serialize[schemaName]`

[hatchedKoa.serialize[schemaName]](./hatchedKoa.serialize.md) has methods to transform the result of [models](#hatchedkoaorm) back into a [JSON:API](../jsonapi/README.md) response.

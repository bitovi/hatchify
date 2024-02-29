# `@hatchifyjs/koa`

`@hatchifyjs/koa` is an [NPM package](https://www.npmjs.com/package/@hatchifyjs/koa) that takes a [Schema](https://github.com/bitovi/hatchify/tree/main/docs/schema#readme) and produces:

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
  - hatchifyKoa - Creates a `hatchedKoa` instance with middleware and sequelize orms
  - HatchifyKoa - A type for TypeScript fans
  - errorHandlerMiddleware -
- [`hatchedKoa`]() -
  - [`hatchedKoa.modelSync`](#hatchedkoamodelsync)
  - [`hatchedKoa.orm`](#hatchedkoaorm)
  - [`hatchedKoa.printEndpoints`](#hatchedkoaprintendpoints)
  - [`hatchedKoa.schema.[schemaName]`](#hatchedkoaschemaschemaname)
  - [`hatchedKoa.middleware.[schemaName|allModels]`](#hatchedkoamiddlewareschemanameallmodels)
  - [`hatchedKoa.parse.[schemaName]`](#hatchedkoaparseschemaname)
  - [`hatchedKoa.model.[schemaName]`](#hatchedkoamodelschemaname)
  - [`hatchedKoa.serialize.[schemaName]`](#hatchedkoaserializeschemaname)
  - [`hatchedKoa.everything.[schemaName]`](#hatchedkoaeverythingschemaname)

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
app.use(hatchify.middleware.allModels.all)
```

so when sending a request like

```
GET /api/todos/invalid
```

it will return an error similar to

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "status": 404,
      "code": "not-found",
      "title": "Resource not found.",
      "detail": "Payload must include an ID of an existing 'Todo'.",
      "source": {
        "parameter": "id"
      }
    }
  ]
}
```

## hatchedKoa

`hatchedKoa` is an instance of [`HatchifyKoa`] that is returned by the [`hatchifyKoa`] function. It provides:

- [Sequelize](https://sequelize.org/) models,
- an expressive [JSON:API](../jsonapi/README.md) restful middleware, and
- utilities for building custom restful endpoints.

The following show some of the methods available given a `Todo` and `User` schema:

```ts
import { hatchifyKoa } from "@hatchifyjs/koa";

const schemas = {
  Todo: { ... },
  User: { ... },
} satisfies Record<string, PartialSchema>

const hatchedKoa = hatchifyKoa(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})


hatchedKoa.schema    .(Todo|User)  // The full schemas
hatchedKoa.orm       .(Todo|User)  // The Sequelize ORM
hatchedKoa.model     .(Todo|User)  // A Hatchify model that extends the underlying ORM
hatchedKoa.middleware.(Todo|User|allModels) // Middleware functions that create restful services
                     .(
                          findAll,          // A GET-many endpoint
                          findAllCountAll,  // Return the unpaginated count
                          findOne,          // A GET-one endpoint
                          create,           // A POST endpoint
                          update,           // A PATCH endpoint
                          destroy,          // A DELETE endpoint
                          all,              // Provides all of the above endpoints
                      )
hatchedKoa.parse     .(Todo|User|allModels) // Parse JSON:API payloads and prepare data for the ORM
                     .(
                          findAll,          //
                          findOne,
                          findAllCountAll,
                          create,
                          update,
                          destroy,
                      )
hatchedKoa.serialize .(Todo|User|allModels) // Return JSON:API responses from instances of the ORM
                     .(
                          findAll,          //
                          findOne,
                          findAllCountAll,
                          create,
                          update,
                          destroy,
                      )
hatchedKoa.modelSync               // Sync the database with the schema
hatchedKoa.printEndpoints          // Prints a list of endpoints generated by Hatchify
```

### hatchedKoa.schema.[schemaName]

`hatchedKoa.schema.[schemaName].[attributes|displayAttribute|name|namespace|pluralName|relationships]`

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

### hatchedKoa.orm

A reference to the `Sequelize` instance when more control is needed.

### hatchedKoa.model[schemaName]

[hatchedKoa.model](./hatchedKoa.model.md) is a collection of methods to create, retrieve, update and delete records using the underlying [ORM](https://sequelize.org/). These methods are grouped by Schema name.

For example, the following shows using `Todo.findAll` to retrieve todo records as JavaScript objects:

```ts
const deserializedTodos = await hatchedKoa.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

Each model has the following methods:

- [findAll](./hatchedKoa.model.md#findall)
- [findAndCountAll](./hatchedKoa.model.md#findandcountall)
- [findOne](./hatchedKoa.model.md#findone)
- [create](./hatchedKoa.model.md#create)
- [update](./hatchedKoa.model.md#update)
- [destroy](./hatchedKoa.model.md#destroy)

### `hatchedKoa.modelSync`

A utility function to make sure your schemas are always synced with the database.

[Read more on Model Sync](../guides/model-sync.md)

### `hatchedKoa.printEndpoints`

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

### `hatchedKoa.middleware.[schemaName|allModels]`

[`hatchedKoa.middleware.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`](./hatchedKoa.middleware.md)

All of the `middleware` functions export a Koa Middleware that can be passed directly to a Koa `app.use` or a Koa `router.[verb]` function, mounted to a specific URL/path. The normal [schemaName] export expects to be used with:

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

### hatchedKoa.parse[schemaName]

[hatchedKoa.parse[schemaName]](./hatchedKoa.parse.md) has methods to parse a [JSON:API](../jsonapi/README.md) request and return options that can be passed to the [models](./hatchedKoa.model.md) to CRUD data.

### `hatchedKoa.serialize.[schemaName]`

[hatchedKoa.serialize[schemaName]](./hatchedKoa.serialize.md) has methods to transform the result of [models](./hatchedKoa.model.md) back into a [JSON:API](../jsonapi/README.md) response.

### `hatchedKoa.everything.[schemaName]`

[hatchedKoa.everything](./hatchedKoa.everything.md) functions very similar to the `middleware` export but is expected to be used more directly, usually when defining user-created middleware.

The `everything` functions takes the same properties as `parse` but goes further than just building the query options. This function will do a complete operation of parsing the request, performing the ORM query operation and then serializing the resulting data to JSON:API format.

For example `hatchedKoa.everything.Todo.findAll` takes the URL query params and directly returns JSON:API ready response data.

```ts
router.get("/skills", async (ctx: Context) => {
  const serializedTodos = await hatchedKoa.everything.Todo.findAll(ctx.query)
  ctx.body = serializedTodos
})
```

## Scratch

- [High Level Export Naming Conventions](#high-level-export-naming-conventions)
- [`@hatchifyjs/koa` Package Exports](#hatchifyjskoa-package-exports)

### `@hatchifyjs/koa` Package Exports

`hatchifyKoa`

- Provides access to the `Hatchify` class constructor
- See [`Hatchify` Class Instance](#hatchify-class-instance) notes below

### `Hatchify` Class Instance

The Hatchify class exports a number of properties that provide functions, generally per-schema, for different common CRUD and REST API operations. Some of these include

- Parameter parsing
- Create / update data validation
- Response formatting / serialization
- ORM query operations
- Combinations of the above

### Naming Conventions

The general naming convention is as follows

`hatchedKoa.[accessor].[schemaName|allModels].[operation]`

- `hatchedKoa` is a variable that points to your Hatchify instance with some assumed number of loaded models. This will always be the entry point into Hatchify.
- `accessor` is a string acting as a namespace to indicate which subset of functions you want to use. This will always be some property exported from Hatchify itself and should have TypeScript support showing the different available options.
- `schemaName` is a property value that, generally, will correspond to one of your loaded models. These models come from the values passed to Hatchify at creation.
  - By convention, because this is being used as a class, the name should use `PascalCase`. An exception is namespaces where name would look like `Namespace_ModelName`. Read more on [naming](../schema/naming.md).
  - In some cases there are special properties like allModels that can signify that the operation should determine the model itself or can otherwise apply to all defined models at once.
- `operation` is a property that reflects the different ORM/CRUD operations that you would like to perform or prepare data for. Because this is called off a specific model the general properties and attribute validation for that model will apply when running the operation.

### High Level Export Naming Conventions

```ts
const hatchedKoa = hatchifyKoa(schemas, options)

hatchedKoa.[
  middleware | parse | model | serialize | everything | modelSync | orm | printEndpoints | schema
].[
  <MODEL_NAME> | allModels
].[
  all
  findAll
  findOne
  findAndCountAll
  create
  update
  destroy
]

hatchedKoa.model.User.findAll

hatchedKoa.middleware.User.create

hatchedKoa.parse.Todo.update

hatchedKoa.serialize.Todo.update
```

- [`Hatchify` Class Instance](#hatchify-class-instance)
- [Naming Conventions](#naming-conventions)

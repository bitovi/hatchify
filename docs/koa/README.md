# `@hatchifyjs/koa`

`@hatchifyjs/koa` is [npm package](https://www.npmjs.com/package/@hatchifyjs/koa) that takes a [Schema](https://github.com/bitovi/hatchify/tree/main/docs/schema#readme) and produces:

- sequelize models,
- an expressive [JSONAPI](https://github.com/bitovi/hatchify/blob/main/docs/jsonapi/README.md) restful middleware, and
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

// Pass schemas and other settings to configure hatchify.
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
- [`hatchedKoa X`]() -
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

- hatchifyKoa - Creates a `hatchedKoa` instance with middleware and sequelize orms
- HatchifyKoa - A type for TypeScript fans
- errorHandlerMiddleware -

```ts
import { hatchifyKoa, HatchifyKoa, errorHandlerMiddleware } from "@hatchifyjs/koa"
```

### hatchifyKoa

`hatchifyKoa` is a `Function` that constructs a `hatchedKoa` instance with middleware and sequelize orms.

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

`schema` is a collection of [Hatchify Schemas](https://github.com/bitovi/hatchify/blob/main/docs/schema/README.md).

`options` is an object with the following key / values:

| Property          | Type                                   | Default                    | Details                                                                                                                                           |
| ----------------- | -------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| uri               | string                                 | sqlite://localhost/:memory | The database URI / connection string of the relational database. Ex. `postgres://user:password@host:port/database?ssl=true`                       |
| logging           | (sql: string, timing?: number) => void | undefined                  | A function that gets executed every time Sequelize would log something.                                                                           |
| additionalOptions | object                                 | undefined                  | An object of additional options, which are passed directly to the underlying connection library (example: [pg](https://www.npmjs.com/package/pg)) |

See [Using Postgres](https://github.com/bitovi/hatchify/blob/main/docs/guides/using-postgres-db.md) for instructions on how to set up HatchifyJS with postgres.

**Returns**

Returns a [hatchedKoa] instance which is documented below.

### HatchifyKoa 

`HatchifyKoa` is the constructor function used to create a [hatchedKoa] instance. This TS type typically isn't used directly (it's exported to support implicit typing of the return from the `hatchifyKoa` constructor); however, it can be useful when defining a custom type that may reference `hatchedKoa`.

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

`errorHandlerMiddleware` is a generic middleware that will take any error thrown in other middleware and transform it to a nice JSON:API response:

```ts
app.use(errorHandlerMiddleware)
app.use(hatchify.middleware.allModels.all)
```

```
GET /api/todos/invalid
```

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
        "pointer": "/data/relationships/todos/data/0/id"
      }
    }
  ]
}
```

## hatchedKoa

`hatchedKoa` is an instance of [`HatchifyKoa`] that is returned by the [`hatchifyKoa`] function. It provides:

- sequelize models,
- an expressive [JSONAPI](https://github.com/bitovi/hatchify/blob/main/docs/jsonapi/README.md) restful middleware, and
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
hatchedKoa.orm       .(Todo|User)  // The sequelize ORM
hatchedKoa.model     .(Todo|User)  // A hatchify model that extends the underlying ORM
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
hatchedKoa.parse     .(Todo|User|allModels) // Parse JSONAPI payloads and prepare data for the orm
                     .(
                          findAll,          // 
                          findOne,
                          findAllCountAll,
                          create,
                          update,
                          destroy,
                      )
hatchedKoa.serialize .(Todo|User|allModels) // Return JSONAPI responses from instances of the orm
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

[hatchedKoa.model](https://github.com/bitovi/hatchify/blob/main/docs/koa/hatchedKoa.model.md) is a collection of methods to create, retrieve, update and delete records using the underlying [orm]. These methods are grouped by Schema name.

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
- [findAndCountAll](#findandcountall)
- [findOne](#findone)
- [create](#create)
- [update](#update)
- [destroy](#destroy)



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

### hatchedKoa.parse[schemaName]

[hatchedKoa.parse[schemaName]](./hatchedKoa.parse.md) has methods to parse a JSONAPI request and return options that can be passed to the [models] to CRUD data.


### `hatchedKoa.serialize.[schemaName]`

`hatchedKoa.serialize.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy|error]`

Functions expected to be used to create valid [JSON:API](../jsonapi/README.md) response:

```json
{
  "data": {
    "type": "Article",
    "id": "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
    "attributes": {
      // ... this article's attributes
    },
    "relationships": {
      // ... this article's relationships
    }
  },
  "included": [
    // ... this article's related objects resolved
  ]
}
```

Normally these functions will take Model data that was returned from the ORM query. This export also includes a slightly different function for helping create JSON:API compliant Error responses.

#### `findAll`: (`data`: Model[], `ops`: SerializerOptions) => `JSONAPIDocument`

Serializes result of multiple instances.

```ts
const serializedTodos = await hatchedKoa.serialize.Todo.findAll([{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }], ["id", "name"])
// serializedTodos = {
//   jsonapi: { version: "1.0" },
//   data: [
//     {
//       type: "Todo",
//       id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//       attributes: { name: "Baking" },
//     }
//   ],
// }
```

#### `findOne`: (`data`: Model, `ops`: SerializerOptions) => `JSONAPIDocument`

Serializes result of a single instance.

```ts
const serializedTodo = await hatchedKoa.serialize.Todo.findOne({ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }, ["id", "name"])
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

#### `findAndCountAll`: (`data`: {count: number; rows: Model[]}, ops: SerializerOptions) => `JSONAPIDocument`

Serializes result of all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

```ts
const serializedTodos = await hatchedKoa.serialize.Todo.findAndCountAll(
  {
    rows: [{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }],
    count: 1,
  },
  ["id", "name"],
)
// serializedTodos = {
//   jsonapi: { version: "1.0" },
//   data: [
//     {
//       type: "Todo",
//       id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//       attributes: { name: "Baking" },
//     }
//   ],
//   meta: { unpaginatedCount: 1 }
// }
```

#### `create`: (`data`: Model, `ops`: SerializerOptions) => `JSONAPIDocument`

Serializes a result of a new instance creation.

```ts
const serializedTodo = await hatchedKoa.serialize.Todo.create({
  id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
  name: "Baking",
})
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

#### `update`: (`count`: number, `ops`: SerializerOptions) => `JSONAPIDocument`

Serializes a result of an update.

```ts
const serializedTodo = await hatchedKoa.serialize.Todo.update(
  {
    id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
    name: "Baking",
  },
  1,
)
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

#### `destroy`: (`count`: number, `ops`: SerializerOptions) => `JSONAPIDocument`

Serializes a result of a deletion.

```ts
const serializedResult = await hatchedKoa.serialize.Todo.destroy(1)
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

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

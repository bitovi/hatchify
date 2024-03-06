# hatchedKoa.parse

`hatchedKoa.parse.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`

The `parse` functions take a given model and return options that can be passed to the ORM to make a corresponding model query.

These functions are expected to be used more directly, usually when defining user-created middleware.

For example `hatchedKoa.parse.Todo.findAll` takes the URL query params and returns Sequelize `FindOptions`. For this sort of request the query params are processed to see if there are any filters, sorts, or other restrictions being placed on the findAll query.

```ts
router.get("/skills", async (ctx: Context) => {
  const findOptions = hatchedKoa.parse.Todo.findAll(ctx.querystring)
  const deserializedTodos = await hatchedKoa.orm.models.Todo.findAll(findOptions)
  ctx.body = deserializedTodos
})
```

The returned `FindOptions` are something that can be directly understood by the ORM and our follow up call to `hatchedKoa.orm.models.Todo.findAll` takes advantage of this to do the actual database lookup for Skills.

Each model has the following methods:

- [findAll](#findall)
- [findAndCountAll](#findandcountall)
- [findOne](#findone)
- [create](#create)
- [update](#update)
- [destroy](#destroy)

## findAll

Parses a query string for searching multiple instances.

`hatchedKoa.parse[schemaName].findAll: (querystring: string) => FindOptions`

```ts
const findOptions = hatchedKoa.parse.Todo.findAll("filter[name]=Baking")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }
```

**Parameters**

| Property    | Type   | Default | Details                                                                              |
| ----------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| querystring | string | `''`    | JSON:API query string specifying filter, pagination, relationships, sort and fields. |

**Returns**

[FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

## findOne

Parses a query string for searching a single instance.

`hatchedKoa.parse[schemaName].findOne: (querystring: string, id?: Identifier) => FindOptions`

```ts
const findOptions = hatchedKoa.parse.Todo.findOne("filter[name]=Baking")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }

const findOptions = hatchedKoa.parse.Todo.findOne("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// findOptions = { where: { id: "b177b838-61d2-4d4d-b67a-1851289e526a" } }
```

**Parameters**

| Property    | Type   | Default     | Details                                                        |
| ----------- | ------ | ----------- | -------------------------------------------------------------- |
| querystring | string | `''`        | JSON:API query string specifying what record to load.          |
| id          | string | `undefined` | A record ID to fetch. Will ignore the querystring if provided. |

**Returns**

[FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

## findAndCountAll

Parses a query string for searching a single instance.

`hatchedKoa.parse[schemaName].findAndCountAll: (querystring: string) => FindOptions`

Parses a query string for searching all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

```ts
const findOptions = hatchedKoa.parse.Todo.findAndCountAll("filter[name]=Baking&limit=1&offset=0")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } }, limit: 1, offset: 0 }
```

**Parameters**

| Property    | Type   | Default | Details                                                                              |
| ----------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| querystring | string | `''`    | JSON:API query string specifying filter, pagination, relationships, sort and fields. |

**Returns**

[FindOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-findAll)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

## create

Parses a query string for creating a new instance.

`hatchedKoa.parse[schemaName].create: (body: object) => CreateOptions`

```ts
const createOptions = hatchedKoa.parse.Todo.create({
  data: {
    type: "Todo",
    attributes: {
      name: "Baking",
    },
  },
})
// createOptions = { body: { name: "Baking" }, ops: {} }
```

**Parameters**

| Property | Type   | Default | Details                                                     |
| -------- | ------ | ------- | ----------------------------------------------------------- |
| body     | object | N/A     | JSON:API formatted object specifying what record to create. |

**Returns**

[CreateOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-create)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

## update

Parses a query string for updating an existing single instance.

`hatchedKoa.parse[schemaName].update: (body: object, id?: Identifier) => UpdateOptions`

```ts
const updateOptions = hatchedKoa.parse.Todo.update({ name: "Serving" }, "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// updateOptions = { body: { name: "Serving" }, ops: { where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" } } }
```

**Parameters**

| Property | Type       | Default | Details                                                         |
| -------- | ---------- | ------- | --------------------------------------------------------------- |
| body     | object     | N/A     | JSON:API formatted object specifying what attributes to update. |
| id       | Identifier | N/A     | A record ID to update. Will update all records if omitted.      |

**Returns**

[UpdateOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-update)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

## destroy

Parses a query string for deleting one or more instances.

`hatchedKoa.parse[schemaName].destroy: (querystring: string, id?: Identifier) => DestroyOptions`

```ts
const destroyOptions = hatchedKoa.parse.Todo.destroy("b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// destroyOptions = { where: { id: "b177b838-61d2-4d4d-b67a-1851289e526a" } }
```

**Parameters**

| Property | Type       | Default | Details                                                          |
| -------- | ---------- | ------- | ---------------------------------------------------------------- |
| id       | Identifier | N/A     | A record ID to destroy. Will ignore the querystring if provided. |

**Returns**

[DestroyOptions](https://sequelize.org/api/v6/class/src/model.js~model#static-method-destroy)

**Throws**

[`RelationshipPathError`](../../packages/node/src/error/types/RelationshipPathError.ts) |
[`UnexpectedValueError`](../../packages/node/src/error/types/UnexpectedValueError.ts) | [`ValueRequiredError`](../../packages/node/src/error/types/ValueRequiredError.ts)

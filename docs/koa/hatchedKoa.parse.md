# hatchedKoa.parse

`hatchedKoa.parse.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`

The `parse` functions take a given model and return options that can be passed to the ORM to make a corresponding model query.

These functions are expected to be used more directly, usually when defining user-created middleware.

For example `hatchedKoa.parse.Todo.findAll` takes the URL query params and returns Sequelize `FindOptions`. For this sort of request the query params are processed to see if there are any filters, sorts, or other restrictions being placed on the findAll query.

```ts
router.get("/skills", async (ctx: Context) => {
  const findOptions = await hatchedKoa.parse.Todo.findAll(ctx.querystring)
  const deserializedTodos = await hatchedKoa.model.Todo.findAll(findOptions)
  ctx.body = deserializedTodos
})
```

The returned `FindOptions` are something that can be directly understood by the ORM and our follow up call to `hatchedKoa.model.Todo.findAll` takes advantage of this to do the actual database lookup for Skills.


## findAll

`hatchedKoa.parse[schemaName].findAll(querystring: string) => FindOptions` parses a query string for searching multiple instances.

```ts
const findOptions = await hatchedKoa.parse.Todo.findAll("filter[name]=Baking")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }
```

## findOne

`hatchedKoa.parse[schemaName].findOne(querystring: string, id?: Identifier) => FindOptions` parses a query string for searching a single instance.

```ts
const findOptions = await hatchedKoa.parse.Todo.findOne("filter[name]=Baking")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }

const findOptions = await hatchedKoa.parse.Todo.findOne("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// findOptions = { where: { id: "b177b838-61d2-4d4d-b67a-1851289e526a" } }
```

## findAndCountAll

`hatchedKoa.parse[schemaName].findAndCountAll(querystring: string) => FindOptions` parses a query string for searching a single instance.

Parses a query string for searching all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

```ts
const findOptions = await hatchedKoa.parse.Todo.findAndCountAll("filter[name]=Baking&limit=10&offset=0")
// findOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }
```

## create

`hatchedKoa.parse[schemaName].create(body: unknown) => CreateOptions` parses a query string for creating a new instance.

```ts
const createOptions = await hatchedKoa.parse.Todo.create({
  data: {
    type: "Todo",
    attributes: {
      name: "Baking",
    },
  },
})
// createOptions = { body: { name: "Baking" }, ops: {} }
```

## update

`hatchedKoa.parse[schemaName].update(body: unknown, id?: Identifier) => UpdateOptions` parses a query string for updating an existing single instance.

```ts
const updateOptions = await hatchedKoa.parse.Todo.update({ name: "Serving" }, "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// updateOptions = { body: { name: "Baking" }, ops: {} }
```

## destroy

`hatchedKoa.parse[schemaName].destroy(querystring: string, id?: Identifier) => DestroyOptions` parses a query string for deleting one or more instances.

```ts
const destroyOptions = await hatchedKoa.parse.Todo.destroy("filter[name]=Baking")
// destroyOptions = { where: { "$Todo.name$": { [Op.eq]: "Baking" } } }

const destroyOptions = await hatchedKoa.parse.Todo.destroy("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// destroyOptions = { where: { id: "b177b838-61d2-4d4d-b67a-1851289e526a" } }
```


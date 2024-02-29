# hatchedKoa.everything

`hatchedKoa.everything.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`

Functions very similar to the `middleware` export but is expected to be used more directly, usually when defining user-created middleware.

The `everything` functions takes the same properties as `parse` but goes further than just building the query options. This function will do a complete operation of parsing the request, performing the ORM query operation and then serializing the resulting data to JSON:API format.

For example `hatchedKoa.everything.Todo.findAll` takes the URL query params and directly returns JSON:API ready response data.

```ts
router.get("/skills", async (ctx: Context) => {
  const serializedTodos = await hatchedKoa.everything.Todo.findAll(ctx.query)
  ctx.body = serializedTodos
})
```

## `findAll`: (`query`: ParsedUrlQuery) => `FindOptions`

Search for multiple instances.

```ts
const serializedTodos = await hatchedKoa.everything.Todo.findAll("filter[name]=Baking")
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

## `findOne`: (`query`: ParsedUrlQuery, `id`: Identifier) => `FindOptions`

Search for a single instance. Returns the first instance found, or null if none can be found.

```ts
const serializedTodo = await hatchedKoa.everything.Todo.findOne("filter[name]=Baking")
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }

const serializedTodo = await hatchedKoa.everything.Todo.findOne("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

## `findAndCountAll`: (`query`: ParsedUrlQuery) => `FindOptions`

Find all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

```ts
const serializedTodos = await hatchedKoa.everything.Todo.findAndCountAll("filter[name]=Baking&limit=10&offset=0")
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

## `create`: (`body`: object) => `CreateOptions`

Creates a new instance.

```ts
const serializedTodo = await hatchedKoa.everything.Todo.create({
  data: {
    type: "Todo",
    attributes: {
      name: "Baking",
    },
  },
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

## `update`: (`body`: object, `id`?: Identifier) => `UpdateOptions`

Updates one or more instances.

```ts
const serializedTodo = await hatchedKoa.serialize.Todo.update({ name: "Serving" }, "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

## `destroy`: (`query`: ParsedUrlQuery, `id`?: Identifier) => `DestroyOptions`

Deletes one or more instances.

```ts
const serializedResult = await hatchedKoa.everything.Todo.destroy("filter[name]=Baking")
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }

const serializedResult = await hatchedKoa.everything.Todo.destroy("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

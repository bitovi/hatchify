# hatchedKoa.serialize

`hatchedKoa.serialize` is a collection of methods to take data from the [hatchedKoa.model](./hatchedKoa.model.md) methods and transform it to [JSON:API](../jsonapi/README.md) response formats that look like the following:

```js
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

## findAll

Serializes result of multiple instances.

`hatchedKoa.serialize[schemaName].findAll(data: PlainRecord[] | ORMRecord[], attributes: string[]) =>JSONAPIDocument`

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

## findAndCountAll

Serializes result of all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

`hatchedKoa.serialize[schemaName].findAndCountAll(data: { count: number; rows: PlainRecord[] | ORMRecord[] }, attributes: string[]) => JSONAPIDocument`

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

## findOne

Serializes result of a single instance.

`hatchedKoa.serialize[schemaName].findOne(data: PlainRecord | ORMRecord, attributes: string[]) => JSONAPIDocument`

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

## create

Serializes a result of a new instance creation.

`hatchedKoa.serialize[schemaName].create(data: Model) =>JSONAPIDocument`

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

## update

Serializes a result of an update.

`hatchedKoa.serialize[schemaName].update(count: number, affectedCount: number) => JSONAPIDocument`

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

## destroy

Serializes a result of a deletion.

`hatchedKoa.serialize[schemaName].destroy(affectedCount: number) => JSONAPIDocument`

```ts
const serializedResult = await hatchedKoa.serialize.Todo.destroy(1)
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

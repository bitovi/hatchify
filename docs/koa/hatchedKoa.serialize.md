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

🛑 Does it take the data from the ORM?  The orm returns sequelize instances.  I think it takes it from a plain JS object returned by `model` functions ...

## findAll

`hatchedKoa.serialize[schemaName].findAll(data: Model[], ops: SerializerOptions) =>JSONAPIDocument` serializes result of multiple instances.

```ts
const serializedTodos = await hatchedKoa.serialize.Todo.findAll(
  [{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }],
  ["id", "name"]
);
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

`hatchedKoa.serialize[schemaName].findAndCountAll(data: {count: number; rows: Model[]}, ops: SerializerOptions) =>JSONAPIDocument` serializes result of all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

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


`hatchedKoa.serialize[schemaName].findOne(data: Model, ops: SerializerOptions) => JSONAPIDocument` serializes result of a single instance.

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

`hatchedKoa.serialize[schemaName].create(data: Model, ops: SerializerOptions) =>JSONAPIDocument`

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

## update

🛑 Signature doesn't match the example 🛑

`hatchedKoa.serialize[schemaName].update(count: number, ops: SerializerOptions) => JSONAPIDocument` serializes a result of an update.

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

`hatchedKoa.serialize[schemaName].destroy(count: number, ops: SerializerOptions) => JSONAPIDocument` serializes a result of a deletion.

```ts
const serializedResult = await hatchedKoa.serialize.Todo.destroy(1)
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

🛑 Do SerializerOptions do anything here 🛑 We also need to document SerializerOptions 🛑

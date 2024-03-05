# hatchedKoa.serialize

`hatchedKoa.serialize` is a collection of methods to take results from the `hatchedKoa.orm.models` methods which is one or more of either `ORMRecord` or `PlainRecord` and transform them to [JSON:API](../jsonapi/README.md) response format that look like the following:

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

Each model has the following methods:

- [findAll](#findall)
- [findAndCountAll](#findandcountall)
- [findOne](#findone)
- [create](#create)
- [update](#update)
- [destroy](#destroy)

## findAll

Serializes result of multiple instances and to show only the specified attributes.

`hatchedKoa.serialize[schemaName].findAll: (data: PlainRecord[] | ORMRecord[], attributes: string[]) => JSONAPIDocument`

```ts
const serializedTodos = hatchedKoa.serialize.Todo.findAll([{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }], ["id", "name"])
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

**Parameters**

| Property   | Type                           | Default     | Details                          |
| ---------- | ------------------------------ | ----------- | -------------------------------- |
| data       | `PlainRecord[] \| ORMRecord[]` | `undefined` | Specify what records to show.    |
| attributes | string[]                       | `undefined` | Specify what attributes to show. |

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

## findAndCountAll

Serializes result of paginated data and a total count to show only the specified attributes. This is very useful for pagination.

`hatchedKoa.serialize[schemaName].findAndCountAll: (data: { count: number; rows: PlainRecord[] | ORMRecord[] }, attributes: string[]) => JSONAPIDocument`

```ts
const serializedTodos = hatchedKoa.serialize.Todo.findAndCountAll(
  {
    rows: [{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }],
    count: 10,
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
//   meta: { unpaginatedCount: 10 }
// }
```

**Parameters**

| Property   | Type                                                    | Default     | Details                                       |
| ---------- | ------------------------------------------------------- | ----------- | --------------------------------------------- |
| data       | `{ data: PlainRecord[] \| ORMRecord[], count: number }` | `undefined` | Specify what records and total cound to show. |
| attributes | string[]                                                | `undefined` | Specify what attributes to show.              |

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

## findOne

Serializes result of a single instance.

`hatchedKoa.serialize[schemaName].findOne: (data: PlainRecord | ORMRecord, attributes: string[]) => JSONAPIDocument`

```ts
const serializedTodo = hatchedKoa.serialize.Todo.findOne({ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }, ["id", "name"])
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }
```

**Parameters**

| Property   | Type                       | Default     | Details                          |
| ---------- | -------------------------- | ----------- | -------------------------------- |
| data       | `PlainRecord \| ORMRecord` | `undefined` | Specify what record to show.     |
| attributes | string[]                   | `undefined` | Specify what attributes to show. |

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

## create

Serializes a result of a new instance creation.

`hatchedKoa.serialize[schemaName].create: (data: PlainRecord | ORMRecord) => JSONAPIDocument`

```ts
const serializedTodo = hatchedKoa.serialize.Todo.create({
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

**Parameters**

| Property   | Type                       | Default     | Details                          |
| ---------- | -------------------------- | ----------- | -------------------------------- |
| data       | `PlainRecord \| ORMRecord` | `undefined` | Specify what record to show.     |
| attributes | string[]                   | `undefined` | Specify what attributes to show. |

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

## update

Serializes a result of an update.

`hatchedKoa.serialize[schemaName].update: (data: PlainRecord | ORMRecord, affectedCount: number) => JSONAPIDocument`

```ts
const serializedTodo = hatchedKoa.serialize.Todo.update(
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

**Parameters**

| Property      | Type                       | Default     | Details                      |
| ------------- | -------------------------- | ----------- | ---------------------------- |
| data          | `PlainRecord \| ORMRecord` | `undefined` | Specify what record to show. |
| affectedCount | number                     | `undefined` | Specify update count.        |

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

## destroy

Serializes a result of a deletion.

`hatchedKoa.serialize[schemaName].destroy: () => JSONAPIDocument`

```ts
const serializedResult = hatchedKoa.serialize.Todo.destroy()
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

**Returns**

[JSONAPIDocument](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/json-api-serializer/index.d.ts#L117)

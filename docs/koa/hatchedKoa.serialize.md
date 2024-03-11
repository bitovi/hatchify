# hatchedKoa.serialize

`hatchedKoa.serialize` is a collection of methods to take results from the `hatchedKoa.orm.models` methods which is one or more of either `ORMRecord` or [`RecordObject`](./README.md#recordobject) and transform them to [JSON:API](../jsonapi/README.md) response format that look like the following:

```ts
const serializedArticle = hatchedKoa.serialize.Article.findOne({ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking", author: { id: "24390449-d661-4ac4-8878-26d45b774679", name: "Justin" } })
// serializedArticle = {
//   data: {
//     type: "Article",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: {
//       name: "Baking",
//     },
//     relationships: {
//       author: {
//         type: "User",
//         id: "24390449-d661-4ac4-8878-26d45b774679",
//       },
//     },
//   },
//   included: [
//     {
//       type: "User",
//       id: "24390449-d661-4ac4-8878-26d45b774679",
//       attributes: {
//         name: "Justin",
//       },
//     },
//   ],
// }
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

`hatchedKoa.serialize[schemaName].findAll(data: RecordObject[] | ORMRecord[], attributes: string[]) => JSONAPIDocument`

```ts
const serializedTodos = hatchedKoa.serialize.Todo.findAll([{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }])
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

| Property | Type                            | Default     | Details                       |
| -------- | ------------------------------- | ----------- | ----------------------------- |
| data     | `RecordObject[] \| ORMRecord[]` | `undefined` | Specify what records to show. |

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## findAndCountAll

Serializes result of paginated data and a total count to show only the specified attributes. This is very useful for pagination.

`hatchedKoa.serialize[schemaName].findAndCountAll(data: { count: number; rows: RecordObject[] | ORMRecord[] }) => JSONAPIDocument`

```ts
const serializedTodos = hatchedKoa.serialize.Todo.findAndCountAll({
  rows: [{ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }],
  count: 10,
})
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

| Property | Type                                                     | Default     | Details                                       |
| -------- | -------------------------------------------------------- | ----------- | --------------------------------------------- |
| data     | `{ data: RecordObject[] \| ORMRecord[], count: number }` | `undefined` | Specify what records and total count to show. |

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## findOne

Serializes result of a single instance.

`hatchedKoa.serialize[schemaName].findOne(data: RecordObject | ORMRecord) => JSONAPIDocument`

```ts
const serializedTodo = hatchedKoa.serialize.Todo.findOne({ id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" })
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

| Property | Type                        | Default     | Details                      |
| -------- | --------------------------- | ----------- | ---------------------------- |
| data     | `RecordObject \| ORMRecord` | `undefined` | Specify what record to show. |

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## create

Serializes a result of a new instance creation.

`hatchedKoa.serialize[schemaName].create(data: RecordObject | ORMRecord) => JSONAPIDocument`

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

| Property   | Type                        | Default     | Details                          |
| ---------- | --------------------------- | ----------- | -------------------------------- |
| data       | `RecordObject \| ORMRecord` | `undefined` | Specify what record to show.     |
| attributes | string[]                    | `undefined` | Specify what attributes to show. |

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## update

Serializes a result of an update.

`hatchedKoa.serialize[schemaName].update(data: RecordObject | ORMRecord) => JSONAPIDocument`

```ts
const serializedTodo = hatchedKoa.serialize.Todo.update({
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

| Property | Type                        | Default     | Details                      |
| -------- | --------------------------- | ----------- | ---------------------------- |
| data     | `RecordObject \| ORMRecord` | `undefined` | Specify what record to show. |

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## destroy

Serializes a result of a deletion.

`hatchedKoa.serialize[schemaName].destroy() => JSONAPIDocument`

```ts
const serializedResult = hatchedKoa.serialize.Todo.destroy()
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

**Returns**

Returns a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

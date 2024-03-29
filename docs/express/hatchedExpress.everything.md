# hatchedExpress.everything

`hatchedExpress.everything.[schemaName].[findAll|findOne|findAndCountAll|create|update|destroy]`

Functions very similar to the `middleware` export but is expected to be used more directly, usually when defining user-created middleware.

The `everything` functions takes the same properties as `parse` but goes further than just building the query options. This function will do a complete operation of parsing the request, performing the ORM query operation and then serializing the resulting data to JSON:API format.

For example `hatchedExpress.everything.Todo.findAll` takes the URL query params and directly returns JSON:API ready response data.

```ts
router.get("/todos", async (req: Request, res: Response) => {
  const serializedTodos = await hatchedExpress.everything.Todo.findAll(req.originalUrl.split("?")[1] || "")
  return res.json(serializedTodos)
})
```

Each model has the following methods:

- [findAll](#findall)
- [findAndCountAll](#findandcountall)
- [findOne](#findone)
- [create](#create)
- [update](#update)
- [destroy](#destroy)

## findAll

`hatchedExpress.everything[schemaName].findAll(querystring: string) => Promise<JSONAPIDocument>` searches for multiple instances.

```ts
const serializedTodos = await hatchedExpress.everything.Todo.findAll("filter[name]=Baking")
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

| Property    | Type   | Default | Details                                                                              |
| ----------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| querystring | string | `''`    | JSON:API query string specifying filter, pagination, relationships, sort and fields. |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## findAndCountAll

`hatchedExpress.everything[schemaName].findAndCountAll(querystring: string) => Promise<JSONAPIDocument>` find all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for paging.

```ts
const serializedTodos = await hatchedExpress.everything.Todo.findAndCountAll("filter[name]=Baking&limit=10&offset=0")
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

**Parameters**

| Property    | Type   | Default | Details                                                                              |
| ----------- | ------ | ------- | ------------------------------------------------------------------------------------ |
| querystring | string | `''`    | JSON:API query string specifying filter, pagination, relationships, sort and fields. |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## findOne

`hatchedExpress.everything[schemaName].findOne(querystring: string, id: Identifier) => Promise<JSONAPIDocument>` search
for a single instance. Returns the first instance found, or null if none can be found.

```ts
const serializedTodo = await hatchedExpress.everything.Todo.findOne("filter[name]=Baking")
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Baking" },
//   },
// }

const serializedTodo = await hatchedExpress.everything.Todo.findOne("", "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
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

| Property    | Type   | Default | Details                                                    |
| ----------- | ------ | ------- | ---------------------------------------------------------- |
| querystring | string | `''`    | JSON:API query string specifying relationships and fields. |
| id          | string | N/A     | The ID of the record to load.                              |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## create

`hatchedExpress.model[schemaName].create(body: object) => Promise<JSONAPIDocument>` creates a new instance.

```ts
const serializedTodo = await hatchedExpress.everything.Todo.create({
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

**Parameters**

| Property    | Type   | Default | Details                                                    |
| ----------- | ------ | ------- | ---------------------------------------------------------- |
| body        | string | N/A     | The data for the new instance.                             |
| querystring | string | `''`    | JSON:API query string specifying relationships and fields. |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## update

`hatchedExpress.model[schemaName].update(body: object, id?: Identifier) => Promise<JSONAPIDocument>` updates one or more instances.

```ts
const serializedTodo = await hatchedExpress.everything.Todo.update({ name: "Serving" }, "b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// serializedTodo = {
//   jsonapi: { version: "1.0" },
//   data: {
//     type: "Todo",
//     id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673",
//     attributes: { name: "Serving" },
//   },
// }
```

**Parameters**

| Property | Type       | Default | Details                                                         |
| -------- | ---------- | ------- | --------------------------------------------------------------- |
| body     | string     | N/A     | JSON:API formatted object specifying what attributes to update. |
| id       | Identifier | N/A     | The ID of the record to update.                                 |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

## destroy

`hatchedExpress.model[schemaName].destroy(id: Identifier) => Promise<JSONAPIDocument>` deletes one or more instances.

```ts
const serializedResult = await hatchedExpress.everything.Todo.destroy("b559e3d9-bad7-4b3d-8b75-e406dfec4673")
// serializedResult = {
//   jsonapi: { version: "1.0" },
//   data: null,
// }
```

**Parameters**

| Property | Type       | Default | Details                         |
| -------- | ---------- | ------- | ------------------------------- |
| id       | Identifier | N/A     | The ID of the record to delete. |

**Resolves**

Resolves to a [JSONAPIDocument](./README.md#jsonapidocument) that can be used as a response body.

# hatchedKoa.model

`hatchedKoa.model` is a collection of methods to create, retrieve, update and delete records using the underlying [orm]. These methods 
are grouped by Schema name.

For example, the following shows using `Todo.findAll` to retrieve todo records as JavaScript objects:

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

const deserializedTodos = await hatchedKoa.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

Each model has the following methods:

- [findAll](#findAll)

## findAll

`hatchedKoa.model[SCHEMA].findAll(options : FindOptions) => [Model]` is a method that retrieves JavaScript objects from the underlying orm and database.

```ts
const deserializedTodos = await hatchedKoa.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

__Parameters__

| Property    | Type           | Default | Details                       |
| ----------- | -------------- | ------- | ----------------------------- |
| options | \[FindOptions] | `{}`    | Specify what records to load. |

__Returns__

🛑 What format? Array of JS objects?

- Can this throw an exception?
- Can it return null?

__Throws__

- Can this throw an exception? 🛑

## findAndCountAll

`hatchedKoa.model[SCHEMA].findAndCountAll(options : FindOptions) => { count: number, rows: Model[] }` finsd all the rows matching your query, within a specified offset / limit, and get the total number of rows matching your query. This is very useful for pagination.

```ts
const deserializedTodos = await hatchedKoa.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
  limit: 10,
  offset: 0,
})
// 🛑 should this be showing the count being returned?
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```


## findOne 

`hatchedKoa.model[SCHEMA].findAll(options: FindOptions) => Model | null` searches for a single instance. Returns the first instance found, or null if none can be found.

```ts
const deserializedTodo = await hatchedKoa.model.Todo.findOne({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodo = { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
```

__Parameters__

| Property    | Type           | Default | Details                       |
| ----------- | -------------- | ------- | ----------------------------- |
| options | \[FindOptions] | `{}`    | Specify what record to load. |

__Returns__

- 🛑 
- Can this throw an exception?
- Can it return null?


## create 

`hatchedKoa.model[SCHEMA].create(body: unknown🛑, options: CreateOptions) => data🛑` creates a new instance.

```ts
const deserializedTodo = await hatchedKoa.model.Todo.create({ name: "Baking" })
// deserializedTodo = { name: "Baking" }
```

__Parameters__

| Property | Type             | Default | Details                        |
| :------- | :--------------- | :------ | :----------------------------- |
| body     | \[unknown🛑]       | N/A     | The data for the new instance. |
| ops      | \[CreateOptions🛑] | N/A     | Options for the creation.      |

__Returns__

🛑 

## update

`hatchedKoa.model[SCHEMA].update(body: unknown, ops: UpdateOptions, id?: Identifier) => number` updates one or more instances.

```ts
const [updatedCount, updatedTodos] = await hatchedKoa.model.Todo.update({ name: "Serving" }, { where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" } })
// updatedCount = 1
// updatedTodos = [{ name: "Baking" }]
```

__Parameters__

🛑 Are UpdateOptions and DestroyOptions different than findOptions?

__Returns__

🛑 

## destroy

`hatchedKoa.model[SCHEMA].destroy(ops: DestroyOptions, id?: Identifier) => number`

Deletes one or more instances.

```ts
const deletedCount = await hatchedKoa.model.Todo.destroy({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deletedCount = 1
```

__Parameters__

🛑 Are UpdateOptions and DestroyOptions different than findOptions?

__Returns__

🛑 

# hatchedKoa.model.md

`hatchedKoa.model` is a collection of ...

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

hatchedKoa.model.Todo.findAll()
```

## findAll

```ts
const deserializedTodos = await hatchedKoa.model.Todo.findAll({
  where: { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673" },
})
// deserializedTodos = [
//   { id: "b559e3d9-bad7-4b3d-8b75-e406dfec4673", name: "Baking" }
// ]
```

__Parameters__

__Returns__

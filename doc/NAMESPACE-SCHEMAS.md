# Schema Namespacing with Postgres

Postgres supports “schemas” which act like namespaces for tables. You can configure the [namespace](naming.md#schemanamespace-postgres-only) setting of a Hatchify schema to set a Postgres schema. If this is confusing, the following might clarify:

In Hatchify:

- A `schema` is a type definition like `const User = {name: "user", attributes: { ... }}`
- A `namespace` is a grouping of schemas (and tables).

In Postgres:

- A `schema` is a grouping of tables.

Sometimes, you want to have multiple tables named the same thing in different domains. Hatchify namespaces can solve this.

The following extends from the [Using Postgres](guides/using-postgres-db.md) guide to have `Todo`’s reference a `User`, who created the todo, and a `Engineering_User` who is someone who can actually get stuff done.

- Update schemas/schemas.ts as follows:

```
export const Todo = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
    dueDate: dateonly(),
    importance: integer({min: 6}),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo("User"),
    assignee: belongsTo("Engineering_User")
  },
} satisfies PartialSchema

export const User = {
  name: "User",
  attributes: {
    name: string({ required: true }),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema

export const Engineering_User = {
  name: "User",
  namespace: "Engineering",
  attributes: {
    name: string({ required: true }),
  },
  relationships: {
    todos: hasMany("Todo",{targetAttribute: "assigneeId"}),
  },
} satisfies PartialSchema
```

- Import and pass all schemas to hatchifyKoa

```
import { Todo, User, Engineering_User } from "../schemas/schemas"

const app = new Koa()
const hatchedKoa = hatchifyKoa(
  { Todo, User, Engineering_User },
  {
    prefix: "/api",
    database: { ... },
  },
)
```

- Make some requests to seed data:

```
curl 'http://localhost:3000/api/engineering/users' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Engineering_User",
    "id": "eeeeeeee-eeee-eeee-eeee-000000000001",
    "attributes": {
      "name": "Engine Nerd"
    }
  }
}'

curl 'http://localhost:3000/api/users' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "User",
    "id": "bbbbbbbb-bbbb-bbbb-bbbb-000000000010",
    "attributes": {
      "name": "Normal User"
    }
  }
}'


curl 'http://localhost:3000/api/todos' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Todo",
    "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000010",
    "attributes": {
      "name": "Walk the dog",
      "dueDate": "2024-12-12",
      "importance": 6
    },
    "relationships" : {
      "user": {
        "data": {
          { "type": "User", "id": "bbbbbbbb-bbbb-bbbb-bbbb-000000000010" }
        }
      },
      "assignee": {
        "data": {
          { "type": "Engineering_User", "id": "eeeeeeee-eeee-eeee-eeee-000000000001" }
        }
      }
    }
  }
}'
```

- Update the frontend/App.tsx to view the people assigned to the employee:

```
// hatchify-app/frontend/App.tsx
import { v2ToV1 } from "@hatchifyjs/core"
import { hatchifyReact, MuiProvider, createJsonapiClient } from "@hatchifyjs/react"
import { Todo, User, Engineering_User } from "../schemas"

export const hatchedReact = hatchifyReact(
  v2ToV1({ Todo, User, Engineering_User }),
  createJsonapiClient("http://localhost:3000/api", {
    Todo: { endpoint: "todos" },
    User: { endpoint: "users" },
    Engineering_User: {endpoint: "engineering-user"}
  }),
)

const TodoList = hatchedReact.components.Todo.Collection

const App: React.FC = () => {
  return (
    <MuiProvider>
      <TodoList />
    </MuiProvider>
  )
}

export default App
```

- Check to make sure your data got loaded correctly. It should be visible in the grid.

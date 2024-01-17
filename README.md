# Hatchify

<img style="float:left" src="https://github.com/bitovi/hatchify/assets/78602/119af4d1-d9ac-439d-aee5-8b9759cf8915">

Hatchify is a web application framework designed to accelerate the development of CRUD applications. If all you need is basic app, Hatchify can provide you with a fully functional system straight from a datatype schema. If you have more specialized requirements, Hatchify makes it easy to customize every part of the application to meet your needs.

Hatchify is structured as a number of modular libraries that can be consumed individually to use as much, or as little, as you require. Hatchify provides the speed of low-code development and the extensibility of custom code.

- [Getting Started](#getting-started)
- [Guides](#guides)
- [API Docs](#api-docs)
- [Need help or have questions?](#need-help-or-have-questions)

## Getting Started

In just a few short steps we will set up a project containing a Hatchify frontend and backend. Our frontend will use [React](https://react.dev/) and [MUI](https://mui.com/), and our backend will be using [Koa](https://koajs.com/). The project also uses [Vite](https://vitejs.dev/) as a dev server which handles much of the React configuration for us.

> ✏️ Perform all the following steps:
> 
> **Note:** The ✏️ icon indicates when to follow along!

1. Ensure you’re using [node 18 and npm
   9 or above](https://nodejs.org/en/download)

   ```bash
   node -v
   npm -v
   ```

2. Create a new project:

   ```bash
   npm init @hatchifyjs@latest
   ```
    - For the backend answer: "Koa" 
    - For the frontend prompt answer: "SQLite"
   
3. Start the server:
   ```bash
   npm run dev
   ```
   
4. Navigate to the Hatchify welcome screen:

IMAGE OF WELCOME SCREEN

Congrats, you’ve got a seed of something great started!

### Schemas

Hatchify’s schemas define your data structure fields and relationships. We share these schemas across our backend and frontend to create database tables, generate REST endpoints, and create React components and data fetchers. Because these schemas are the backbone of our frontend and backend, we will place them in the empty schemas.ts file at the root directory of our project.

> ✏️ Update `schemas.ts` file with the following:

```ts
// hatchify-app/schemas.ts
import { belongsTo, boolean, dateonly, integer, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

export const Todo = {
  name: "Todo", // 👀
  attributes: {
    name: string({ required: true }), // 👀
    dueDate: dateonly(),
    importance: integer(),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo("User"), // 👀
  },
} satisfies PartialSchema

export const User = {
  name: "User",
  attributes: {
    name: string({ required: true }),
  },
  relationships: {
    todos: hasMany("Todo"), // 👀
  },
} satisfies PartialSchema
```

This defines a `Todo` and `User` type, each with some attributes. It also creates a  relationship where a Todo `belongsTo` a User, and each user `hasMany` Todos.

You can refer to [our documentation](/doc/schema/README.md) for more information on how to define schemas.

### Seed Data

Hatchify doesn’t currently generate forms (though we are working on it!). To add data, you can use the REST APIs that Hatchify’s middleware provides.

# Seeding Sample Data

> ✏️ Run the following commands to create some sample data.

```bash
curl 'http://localhost:3000/api/todos' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Todo",
    "attributes": {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000002",
      "name": "Walk the dog",
      "dueDate": "2024-12-12",
      "importance": 6
    }
  }
}'

curl 'http://localhost:3000/api/todos' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Todo",
    "attributes": {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000003",
      "name": "Laundry",
      "dueDate": "2024-12-02",
      "importance": 1
    }
  }
}'

curl 'http://localhost:3000/api/todos' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Todo",
    "attributes": {
      "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000004",
      "name": "Making Calls",
      "dueDate": "2024-12-31",
      "importance": 7
    }
  }
}'

curl 'http://localhost:3000/api/users' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "User",
    "attributes": {
      "name": "John Doe"
    },
    "relationships": {
      "todos": {
        "data": [
          {
            "type": "Todo",
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000002"
          },
          {
            "type": "Todo",
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000004"
          }
        ]
      }
    }
  }
}'

curl 'http://localhost:3000/api/users' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "User",
    "attributes": {
      "name": "Jane Doe"
    },
    "relationships": {
      "todos": {
        "data": [
          {
            "type": "Todo",
            "id": "aaaaaaaa-aaaa-aaaa-aaaa-000000000003"
          }
        ]
      }
    }
  }
}'
```

To learn more about the service layer, read [the docs regarding our JSONAPI implementation](./doc/jsonapi/README.md)

With some data in place, we can now further review the project.

### Interact with the UI

Now that data has been seeded the UI should look like:

IMAGE OF UI

You can start using this basic app to sort & filter the data:

IMAGE OF FILTERING

What you've built is currently bare bones, but read through our guides in the following section to learn how to enhance it to meet your needs. 

## Next Steps

Continue learning more about the Hatchify feature set with these guides that continue from the example above:

- [Using PostgreSQL DB](./doc/guides/using-postgres-db.md)
- [Model Sync](./doc/guides/model-sync.md)
- [Adding custom endpoints](./doc/guides/adding-custom-endpoints.md)
- [Adding request authorization](./doc/guides/adding-request-authorization.md)
- [Customizing your list](./doc/guides/customizing-your-list.md)
- [Adding checkboxes to the list](./doc/guides/adding-checkboxes-to-the-list.md)
- [Application data validation](./doc/guides/application-data-validation.md)

## API Docs

Dig deep into how the internals of how Hatchify works in the technical interface documentation:

- [Schema](./doc/schema/)
  - [Attributes](./doc/schema/attribute-types/README.md)
  - [Relationships](./doc/schema/relationship-types/README.md)
  - [Schema Naming](./doc/schema/naming.md)
- [JSON:API](./doc/jsonapi/README.md)
  - [Creating](./doc/jsonapi/creating.md)
  - [Reading](./doc/jsonapi/reading/README.md)
    - [Filtering](./doc/jsonapi/reading/filtering/README.md)
    - [Paginating](./doc/jsonapi/reading/paginating/README.md)
    - [Sorting](./doc/jsonapi/reading/sorting/README.md)
    - [Relationships](./doc/jsonapi/reading/relationships/README.md)
    - [Sparse Fields](./doc/jsonapi/reading/sparse-fields/README.md)
  - [Updating](./doc/jsonapi/updating.md)
  - [Deleting](./doc/jsonapi/deleting.md)
- Koa
  - [API Docs](./doc/koa/README.md)
- Express
  - [API Docs](./doc/express/README.md) 🛑
- React
  - [API Docs](./doc/react/README.md)
  - [Components](./doc/react/components.md)
  - [REST Client](./doc/react/rest-client.md) 🛑

## Need help or have questions?

This project is supported by [Bitovi](https://bitovi.com/), a web software consultancy. You can get help or ask questions on our:

- [Discord Community](https://discord.com/invite/J7ejFsZnJ4)

- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/digital-consulting-services)

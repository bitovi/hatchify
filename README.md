# Hatchify

<img style="float:left" src="https://github.com/bitovi/hatchify/assets/78602/119af4d1-d9ac-439d-aee5-8b9759cf8915">

Hatchify is a web application framework designed to accelerate the development of CRUD applications. If all you need is basic app, Hatchify can provide you with a fully functional system straight from a datatype schema. If you have more specialized requirements, Hatchify makes it easy to customize every part of the application to meet your needs.

Hatchify enables you to make changes to your database schema and customize app behavior **independently** of each other, unlike code-generation dependent approaches. It avoids code generation in favor of modular libraries that can be used incrementally, to utilize as much or as little of the framework's abilities as you require.

- [Getting Started](#getting-started)
- [Guides](#guides)
- [API Docs](#api-docs)
- [Need help or have questions?](#need-help-or-have-questions)

# Getting Started

In just a few short steps we will set up a project containing a Hatchify frontend and backend. Our frontend will use React and MUI, and our backend will be using Koa. The project also uses Vite as a dev server which handles much of the React configuration for us.

> **Note:** The ✏️ icon indicates when to follow along!

✏️ Perform all the following steps:

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

# Schemas

A schema is a definition of a resource used in our Hatchify system. We use these shared schemas across our backend and frontend to create database tables, generate REST endpoints, and create React components
and data fetchers. Because these schemas are the backbone of our frontend and backend, we will place them in the empty `schemas.ts`file at the root directory of our project.

The required fields of the schema are a `name` for your model and the`attributes` that will be held within it. If you have written ORM models before, particularly Sequelize, this will look familiar to you.

> **Note:** Take note of lines commented with the 👀 emoji.

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

> **Note:** It is important to use _satisfies PartialSchema_ when typing our schemas. By using the satisfies keyword, we can make sure our schema objects are typed correctly and also get the benefit of type inference when passing our schemas into our Hatchify functions.

You can find all the possible data types for a schema's `attributes` [here](./doc/schema/attribute-types/README.md).

# Backend - Schema Defined Endpoints

Now we can run this application, and Hatchify will create CRUD application endpoints for our `User` and `Todo` models automatically. This step will take care of not only setting up your database resources, but also validating your schemas against each other, ensuring all your relationship fields make sense.

To run the server: ✏️

```bash
npm run dev
```

You can navigate to the following endpoints to get a list of users and todos (but we won't have any just yet):

[http://localhost:3000/api/users](http://localhost:3000/api/users)

[http://localhost:3000/api/todos](http://localhost:3000/api/todos)

# Seeding Sample Data

**✏️ Run the following commands in your terminal to save some sample data: **

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

With the dev server running and some data in place, we can now further review the project.

# Frontend - React and MUI

Let's review the contents of `frontend/App.tsx` to see how the schemas that we defined earlier conveniently "hatch" our frontend.

The first you'll see is the imports of `hatchifyReact`, `HatchifyProvider`, and `createJsonapiClient` from the `@hatchify/react` library. Here’s a quick overview of what each of these does:

- `createJsonapiClient` - This is our rest client for JSON:API. We pass in the `baseUrl` of our backend to it, as well as our schemas.

- `HatchifyProvider` - This is a MUI theme provider that we must wrap around our entire app so that our Hatchify components will render with the correct style.

- `hatchifyReact` - This function takes in our rest client and returns an object containing React components and data access functions for each schema. This returned object represents our entire frontend Hatchify app.

With that those Hatchify elements generated from our schema, we can pull the `Everything` "splash screen" component from `hatchifyReact` and render it.

## Rendering an index of schemas & data

**✏️**Open
[http://localhost:3000/](http://localhost:3000/). You
should see:

![image](https://github.com/bitovi/hatchify/assets/2623867/9b5b8f0d-970d-4f86-a893-2f48c74f0474)

And that’s it! With minimal code and some Hatchify magic, we've used our schemas to create a database, a backend with REST endpoints, and a frontend that handles the JSX and data-fetching for us.

# Guides

Continue learning more about the Hatchify feature set with these guide that continue from the example project above:

- [Schema, database, and service API naming](./doc/guides/naming.md)
- [Model Sync](./doc/guides/model-sync.md)
- [Using PostgreSQL DB](./doc/guides/using-postgres-db.md)
- [Adding custom endpoints](./doc/guides/adding-custom-endpoints.md)
- [Adding request authorization](./doc/guides/adding-request-authorization.md)
- [Customizing your list](./doc/guides/customizing-your-list.md)
- [Adding checkboxes to the list](./doc/guides/adding-checkboxes-to-the-list.md)
- [Application data validation](./doc/guides/application-data-validation.md)

# API Docs

Dig deep into how the internals of how Hatchify works in the technical interface documentation:

- [Schema](./doc/schema/)
  - [Attributes](./doc/schema//attribute-types/README.md)
  - [Relationships](./doc/schema/relationship-types/README.md)
- [JSON:API](./doc/jsonapi//README.md)
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
  - [Components](./doc/react/components.md) 🛑
  - [REST Client](./doc/react/rest-client.md) 🛑

# Need help or have questions?

This project is supported by [Bitovi](https://bitovi.com/), a web software consultancy. You can get help or ask questions on our:

- [Discord Community](https://discord.com/invite/J7ejFsZnJ4)

- [Twitter](https://twitter.com/bitovi)

Or, you can hire us for training, consulting, or development. [Set up a free consultation.](https://www.bitovi.com/digital-consulting-services)

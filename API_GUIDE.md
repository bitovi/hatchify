# Introduction

This document covers API topics not included in the [Getting Started Guide](./README.md).  Think of it as a Getting Moving Guide, once you've started from the other guide.

# Implementing Virtual Fields

Just like Sequelize, Hatchify supports the creating of virtual fields through the implementation of a getter and the definition of it's type as virtual. These virtual fields will not be created in your database, but generated under the hood. In this tutorial we will create a virtual field called "hasTodos" in the User model, this field will return true if the user record is related to any todos and false if the user is not.

## :pencil2: Perform the following steps:

1. Update the file "User.ts" inside of the schemas directory to have a virtual field `hasTodos`, which uses Sequelize's `VIRTUAL` type and `include`s any related data necessary to compute the field's value:

```js
// hatchify-app/schemas/User.ts
import { DataTypes } from "@hatchifyjs/koa"
import type { Model } from "sequelize"

export const User = {
  name: "User",
  attributes: {
    name: "STRING",
    hasTodos: {
      type: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
      include: "todos",
      get(this: { todos: Model[] }) {
        return !!this.todos.length
      },
    },
  },
  hasMany: [{ target: "Todo", options: { as: "todos" } }],
};

```

2. Start or restart your server.  To restart, type `rs` if running the `dev:backend` script, or use `ctrl+c` to stop the server before starting again from the command line.

3. Create a new Todo

```bash
$ curl 'http://localhost:3000/api/todos' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "Todo",
    "attributes": {
      "id": "101",
      "name": "Walk the dog",
      "due_date": "2024-12-12",
      "importance": 6
    }
  }
}'
```

4. Create a new User that owns the Todo

```bash
$ curl 'http://localhost:3000/api/users' \
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
            "id": "101"
          }
        ]
      }
    }
  }
}'
```

```bash
{ "data": { "type": "User", "attributes": {}, "relationships": { "todos": { "data": [{ "type": "Todo", "id": "101" }] } } } }
```

5. Create a new User that does not own a Todo

```bash
$ curl 'http://localhost:3000/api/users' \
--header 'Content-Type: application/vnd.api+json' \
--data '{
  "data": {
    "type": "User",
    "attributes": {
      "name": "Mary Jane"
    }
  }
}'
```

6. Make a request to test your virtual field:
   Virtual fields are not included by default, you'll need to explicitly request them in your URL.

```bash
$ curl 'http://localhost:3000/api/users?fields%5BUser%5D=name,hasTodos&include=todos' --header 'Content-Type: application/vnd.api+json'
```

You will get the appropriate data for each user.

```bash
{"jsonapi":{"version":"1.0"},"meta":{"unpaginatedCount":1},"data":[{"type":"User","id":"1","attributes":{"hasTodos":true},"relationships":{"todos":{"data":[{"type":"Todo","id":"101"}]}}},{"type":"User","id":"2","attributes":{"hasTodos":false},"relationships":{"todos":{"data":[]}}}],"included":[{"type":"Todo","id":"101","attributes":{"name":"Walk the dog","due_date":null,"importance":6,"status":null}}]}
```

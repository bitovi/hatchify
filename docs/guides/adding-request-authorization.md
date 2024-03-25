# Adding request authorization

So you have a working app and you want to limit access to specific users. Due to the nature of Hatchify where we opt-in to use the auto-generated middleware, adding authorization check is as simple as adding another middleware to your favorite backend framework. A common way to maintain an HTTP session is using cookies, since browsers will automatically attach them to all requests sent to our backend.

## Prerequisites

If you are using `Koa`, we suggest using [`co-body`](https://www.npmjs.com/package/co-body) to parse request body easily:

```bash
npm install co-body
npm install @types/co-body --save-dev
```

## Example

Given a pre-existing schema `Case` and some seeded data, we can use the below command to get all cases:

```curl
curl http://localhost:3000/api/cases
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Case",
      "id": "20ffbc05-df92-46ed-b14e-a694c595c39d",
      "attributes": {
        "status": "open"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

Now we want to add request authorization, while keeping the existing Hatchify logic working as before.

```typescript
import Koa from "koa"
import parse from "co-body" // 👀
import { hatchifyKoa } from "@hatchifyjs/koa"
import * as Schemas from "../schemas"

const app = new Koa()
const hatchedKoa = hatchifyKoa(Schemas, {
  prefix: "/api",
  database: {
    uri: process.env.DB_URI,
  },
})

;(async () => {
  // This is the authentication middleware we add to set the value of the `auth` cookie
  app.use(async (ctx, next) => {
    if (ctx.method !== "POST" || ctx.url !== "/login") {
      return next()
    }

    const body = await parse(ctx)

    if (!body) {
      return next()
    }

    // TODO: These are here just for demo purposes. They should live in the database or a 3rd party service.
    const users: Record<string, string> = {
      admin: "adminPassword",
      user: "userPassword",
    }

    const { username, password } = body

    if (password === users[username]) {
      ctx.cookies.set("auth", "custom-value")
      return ctx.redirect("/")
    }

    ctx.status = 401
    ctx.body = {
      errors: [
        {
          status: 401,
          code: "unauthorized",
        },
      ],
    }
  })

  // This is the authorization middleware we add to check the value of the `auth` cookie
  app.use(async (ctx, next) => {
    const authToken = ctx.header.cookie?.match(/auth=([^;]*)/)?.[1]

    if (authToken === "custom-value") {
      return next()
    }

    ctx.status = 401
    ctx.body = {
      jsonapi: { version: "1.0" },
      errors: [
        {
          status: 401,
          code: "unauthorized",
        },
      ],
    }
  })

  app.use(hatchedKoa.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

Now trying to get all the cases will throw an `Unauthorized` error:

```curl
curl http://localhost:3000/api/cases
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "errors": [
    {
      "status": 401,
      "code": "unauthorized"
    }
  ]
}
```

However, when the browser (or Postman) is making a request to `/login` with `{ "username": "admin", "password": "adminPassword" }` it will set a cookie and automatically attach it to all future requests, allowing to access our routes:

```curl
curl http://localhost:3000/api/cases --cookie "auth=custom-value"
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Case",
      "id": "20ffbc05-df92-46ed-b14e-a694c595c39d",
      "attributes": {
        "status": "open"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

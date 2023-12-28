# Adding request authorization

While Hatchify gives you a lot of power out of the box many applications, especially as they grow in complexity, need to apply custom rules and logic to their CRUD operations. Hatchify is prepared for this as well, allowing you to easily and flexibly override any of the default behavior to fit your needs. Even though you have customized the solution you can still use many of the Hatchify helper functions and features to accelerate development.

This is helpful if you need to:

- Enforce request authorization
- Add custom validation
- Integrate with 3rd party services
- Handle file uploads/downloads

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
  // This is the auth middleware we add to check the value of the `auth` cookie
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

However, passing the right auth cookie will get all the results:

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

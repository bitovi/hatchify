# `@hatchifyjs/express`

- [What is `@hatchifyjs/express`?](#what-is-hatchifyjsexpress)
- [Example Usage](#example-usage)
- [More Documentation](#more-documentation)

## What is `@hatchifyjs/express`?

`@hatchifyjs/express` is a schema-driven library of middleware for your Hatchify app. By defining the schemas (AKA models) of your backend resources, `@hatchifyjs/express` will provide you with a set of functions that you can use across your Express app.

## Example Usage

```ts
import { datetime, string, PartialSchema } from "@hatchifyjs/core"
import { hatchifyExpress } from "@hatchifyjs/express"
import Express from "express"

const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
    },
  },
} satisfies Record<string, PartialSchema>

const app = Express()

const hatchedExpress = hatchifyExpress(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})

;(async () => {
  await hatchedExpress.modelSync({ alter: true })

  app.use(hatchedExpress.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

## More Documentation

[`@hatchifyjs/express` Documentation](https://github.com/bitovi/hatchify/blob/main/docs/express/README.md)

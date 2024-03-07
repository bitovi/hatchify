# `@hatchifyjs/koa`

- [What is `@hatchifyjs/koa`?](#what-is-hatchifyjskoa)
- [Example Usage](#example-usage)
- [More Documentation](#more-documentation)

## What is `@hatchifyjs/koa`? 

`@hatchifyjs/koa` is a schema-driven library of middleware for your Hatchify app. By defining the schemas (AKA models) of your backend resources, `@hatchifyjs/koa` will provide you with a set of functions that you can use across your Koa app.

## Example Usage

```ts
import { datetime, string, PartialSchema } from "@hatchifyjs/core"
import { hatchifyKoa } from "@hatchifyjs/koa"
import Koa from "koa"

const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
    },
  },
} satisfies Record<string, PartialSchema>

const app = new Koa()
const hatchedKoa = hatchifyKoa(schemas, {
  prefix: "/api",
  database: { uri: "sqlite://localhost/:memory" },
})

;(async () => {
  await hatchedKoa.modelSync({ alter: true })

  app.use(hatchedKoa.middleware.allModels.all)

  app.listen(3000, () => {
    console.log("Started on http://localhost:3000")
  })
})()
```

## More Documentation

[`@hatchifyjs/koa` Documentation](https://github.com/bitovi/hatchify/blob/main/doc/koa/README.md)

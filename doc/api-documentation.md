# API Documentation

This page links to all the other API documentation. This is like a big cheat sheet.

## Schema

<pre>
import { PartialSchema, belongsTo, boolean, datetime, integer, hasMany, string } from "@hatchifyjs/core"
  
export const SalesPerson: <a href="./naming.md">PartialSchema</a> = {
  <a href="./naming.md#schemaname">name</a>: "SalesPerson",
  <a href="./naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  attributes: {
    <a href="./naming.md#schemaattributesattribute_name">name</a>: <a href="./attribute-types/string.md">string</a>({ required: true }),
    dueDate: <a href="./attribute-types/datetime">datetime</a>(),
    importance: integer(),
    complete: boolean({ default: false }),
  },
  relationships: {
    user: belongsTo(),
  },
}
</pre>

## Backend

<pre>
const hatchedKoa = hatchifyKoa(
  { SalesPerson },
  {
    prefix: "/api",
    database: {
      dialect: "sqlite",
      storage: ":memory:",
    },
  }
)
</pre>

- `.middleware`
  - `.allModels`
    - `.all`
    - `.crud`
    - `.findAndCountAll`
    - `.findOne`
    - `.create`
    - `.update`
    - `.destroy`
 - `.[MODEL_NAME]
    - `.all`
    - `.crud`
    - `.findAndCountAll`
    - `.findOne`
    - `.create`
    - `.update`
    - `.destroy`

## Frontend

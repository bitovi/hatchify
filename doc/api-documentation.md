# API Documentation

This page links to all the other API documentation. This is like a big cheat sheet.

## Schema

<pre>
import { PartialSchema, belongsTo, boolean, datetime, integer, hasMany, string } from "@hatchifyjs/core"
  
export const SalesPerson: <a href="./naming.md">PartialSchema</a> = {
  <a href="./naming.md#schemaname">name</a>: "SalesPerson",
  <a href="./naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  id: <a href="./attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  attributes: {
    <a href="./naming.md#schemaattributesattribute_name">name</a>: <a href="./attribute-types/string.md">string</a>({ required: true }),
    description: <a href="./attribute-types/text">text</a>(),
    dueDate: <a href="./attribute-types/datetime">datetime</a>(),
    importance: <a href="./attribute-types/integer.md">integer</a>({min: 0, max: 100, step: 10}),
    complete: <a href="./attribute-types/boolean.md">boolean</a>({ default: false }),
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

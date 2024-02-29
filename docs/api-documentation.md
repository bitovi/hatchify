# API Documentation

This page links to all the other API documentation. This is like a big cheat sheet.

## Schema

<pre>
import { PartialSchema, belongsTo, boolean, datetime, integer, hasMany, string } from "@hatchifyjs/core"
  
export const SalesPerson = {
  <a href="schema/naming.md#schemaname">name</a>: "SalesPerson",
  <a href="schema/naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  id: <a href="schema/attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  attributes: {
    <a href="schema/naming.md#schemaattributesattribute_name">name</a>: <a href="./attribute-types/string.md">string</a>({ required: true }),
    description: <a href="schema/attribute-types/text.md">text</a>(),
    dueDate: <a href="schema/attribute-types/datetime.md">datetime</a>(),
    importance: <a href="schema/attribute-types/integer.md">integer</a>({min: 0, max: 100, step: 10}),
    complete: <a href="schema/attribute-types/boolean.md">boolean</a>({ default: false }),
  },
  relationships: {
    salesGroup: <a href="schema/relationship-types/belongs-to.md">belongsTo</a>(),
    accounts:   <a href="schema/relationship-types/has-many.md">hasMany</a>(),
    todos:      hasMany().<a href="schema/relationship-types/has-many-through.md">through</a>()
  },
} satisfies <a href="schema/naming.md">PartialSchema</a>
</pre>

## Backend

<pre>
import { hatchifyKoa } from "<a href="./koa/README.md">@hatchifyjs/core</a>"
  
const <a href="./koa/README.md#hatchedkoa">hatchedKoa</a> = <a href="./koa/README.md#hatchifykoa">hatchifyKoa</a>({ SalesPerson }, { prefix: "/api" })

await hatchedKoa.<a href="./koa/hatchedKoa.model.md#findall">model</a>.SalesPerson.<a href="./koa/hatchedKoa.model.md#findall">findAll</a>({})
await hatchedKoa.model.SalesPerson.<a href="./koa/hatchedKoa.model.md#findandcountall">findAndCountAll</a>({})
await hatchedKoa.model.SalesPerson.<a href="./koa/hatchedKoa.model.md#findOne">findOne</a>(where: { id: "UUID" })
await hatchedKoa.model.SalesPerson.<a href="./koa/hatchedKoa.model.md#create">create</a>({name: "Justin"})
await hatchedKoa.model.SalesPerson.<a href="./koa/hatchedKoa.model.md#update">update</a>({name: "Roye"}, { where: { id: "UUID" } })
await hatchedKoa.model.SalesPerson.<a href="./koa/hatchedKoa.model.md#update">destroy</a>({ where: { id: "UUID" } })
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

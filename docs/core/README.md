# @hatchifyjs/core

`@hatchifyjs/core` provides core libraries and types for defining Schemas. Schemas are used by other packages like [@hatchifyjs/koa](../koa/README.md) and [@hatchifyjs/react](../react/README.md) to provide low-code-like functionality.

The following defines a `SalesPerson` schema that has multiple attributes (aka fields) and relationships with other schemas:

<pre>
import { PartialSchema, 
  boolean, datetime, dateonly, integer, string, enumerate
  belongsTo, hasMany, hasOne } from "@hatchifyjs/core"
  
export const SalesPerson = {
  <a href="./PartialSchema.md#schemaname">name</a>: "SalesPerson",
  <a href="./PartialSchema.md#schemapluralname">pluralName</a>: "SalesPeople",
  <a href="./PartialSchema.md#id">id</a>: <a href="./attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  <a href="./attribute-types/README.md">attributes</a>: {
    <a href="./PartialSchema.md#general-guidelines">name</a>:         <a href="./attribute-types/string.md">string</a>({ required: true }),
    description:  <a href="./attribute-types/text.md">text</a>(),
    hireDate:     <a href="./attribute-types/datetime.md">datetime</a>(),
    birthday:     <a href="./attribute-types/datetime.md">dateonly</a>(),
    commission:   <a href="./attribute-types/number.md">number</a>({min: 0}),
    importance:   <a href="./attribute-types/integer.md">integer</a>({min: 0, max: 100, step: 10}),
    isSenior:     <a href="./attribute-types/boolean.md">boolean</a>({ default: false }),
    status:       <a href="./attribute-types/enum.md">enumerate</a>({ values: ["active", "inactive"] }),
    salesGroupId: <a href="./attribute-types/uuid.md">uuid</a>(),
  },
  <a href="./relationship-types/README.md">relationships</a>: {
    salesGroup: <a href="./relationship-types/belongs-to.md">belongsTo</a>(),
    accounts:   <a href="./relationship-types/has-many.md">hasMany</a>(),
    todos:      hasMany().<a href="./relationship-types/has-many-through.md">through</a>()
    user:       <a href="./relationship-types/has-one.md">hasOne</a>()
  },
} satisfies <a href="./PartialSchema.md">PartialSchema</a>
</pre>

To learn how to define a schema, we suggest reading:

- [PartialSchema](./PartialSchema.md) - To understand how to define a schema and how it effects the database, API, and UI.
- [Attributes](./attribute-types/README.md) - How to specify attributes on a schema.
- [Relationships](./relationship-types/README.md) - How to specify relationships on a schema.

## Exports

`@hatchifyjs/core` exports the following types and methods to help you build a schema:

Types:

- [`PartialSchema`](./PartialSchema.md) - Defines the shape of a schema for one type

Attributes:

- [`boolean`](./attribute-types/boolean.md)
- [`dateonly`](./attribute-types/dateonly.md)
- [`datetime`](./attribute-types/datetime.md)
- [`enumerate`](./attribute-types/enum.md)
- [`integer`](./attribute-types/integer.md)
- [`number`](./attribute-types/number.md)
- [`string`](./attribute-types/string.md)
- [`text`](./attribute-types/text.md)
- [`uuid`](./attribute-types/uuid.md)

Relationships:

- [`belongsTo`](./relationship-types/belongs-to.md)
- [`hasMany`](./relationship-types/has-many.md)
- [`hasMany().through`](./relationship-types/has-many-through.md)
- [`hasOne`](./relationship-types/has-one.md)

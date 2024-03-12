# @hatchifyjs/core

`@hatchifyjs/core` provides core libraries and types for defining Schemas. Schemas are used by other packages like [@hatchifyjs/koa](../koa/README.md) and [@hatchifyjs/react](../react/README.md) to provide low-code-like functionality.

The following defines a `SalesPerson` schema that has multiple attributes (aka fields) and relationships with other schemas:

<pre>
import { PartialSchema, 
  boolean, datetime, dateonly, integer, string, enumerate
  belongsTo, hasMany, hasOne } from "@hatchifyjs/core"
  
export const SalesPerson = {
  <a href="core/PartialSchema.md#schemaname">name</a>: "SalesPerson",
  <a href="core/PartialSchema.md#schemapluralname">pluralName</a>: "SalesPeople",
  <a href="./PartialSchema.md#id">id</a>: <a href="core/attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  <a href="./core/attribute-types/README.md">attributes</a>: {
    <a href="core/PartialSchema.md#general-guidelines">name</a>:         <a href="core/attribute-types/string.md">string</a>({ required: true }),
    description:  <a href="core/attribute-types/text.md">text</a>(),
    hireDate:     <a href="core/attribute-types/datetime.md">datetime</a>(),
    birthday:     <a href="./core/attribute-types/datetime.md">dateonly</a>(),
    commission:   <a href="./core/attribute-types/number.md">number</a>({min: 0}),
    importance:   <a href="core/attribute-types/integer.md">integer</a>({min: 0, max: 100, step: 10}),
    isSenior:     <a href="core/attribute-types/boolean.md">boolean</a>({ default: false }),
    status:       <a href="core/attribute-types/enum.md">enumerate</a>({ values: ["active", "inactive"] }),
    salesGroupId: <a href="./core/attribute-types/uuid.md">uuid</a>(),
  },
  <a href="./core/relationship-types/README.md">relationships</a>: {
    salesGroup: <a href="core/relationship-types/belongs-to.md">belongsTo</a>(),
    accounts:   <a href="core/relationship-types/has-many.md">hasMany</a>(),
    todos:      hasMany().<a href="core/relationship-types/has-many-through.md">through</a>()
    user:       <a href="./core/relationship-types/has-one.md">hasOne</a>()
  },
} satisfies <a href="core/PartialSchema.md">PartialSchema</a>
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

- [`boolean`](./boolean.md)
- [`dateonly`](./dateonly.md)
- [`datetime`](./datetime.md)
- [`enumerate`](./enum.md)
- [`integer`](./integer.md)
- [`number`](./number.md)
- [`string`](./string.md)
- [`text`](./text.md)
- [`uuid`](./uuid.md)

Relationships:

- [`belongsTo`](./belongs-to.md)
- [`hasMany`](./has-many.md)
- [`hasMany().through`](./has-many-through.md)
- [`hasOne`](./has-one.md)

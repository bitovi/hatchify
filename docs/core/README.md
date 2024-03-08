# @hatchifyjs/core

`@hatchifyjs/core` provides core libraries and types for defining Schemas. Schemas are used by other packages like [@hatchifyjs/koa](../koa/README.md) and [@hatchifyjs/react](../react/README.md) to provide low-code-like functionality.

The following defines a `SalesPerson` schema that has multiple attributes (aka fields) and relationships with other schemas:

<pre>
import { PartialSchema, 
  boolean, datetime, dateonly, integer, string, enumerate
  belongsTo, hasMany, hasOne } from "@hatchifyjs/core"
  
export const SalesPerson = {
  <a href="core/naming.md#schemaname">name</a>: "SalesPerson",
  <a href="core/naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  id: <a href="core/attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  <a href="./core/attribute-types/README.md">attributes</a>: {
    <a href="core/naming.md#general-guidelines">name</a>:         <a href="core/attribute-types/string.md">string</a>({ required: true }),
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
} satisfies <a href="core/naming.md">PartialSchema</a>
</pre>




Hatchify Schema

Hatchify provides its own interface for defining your data, called "schemas". The documentation for this interface is split into the following sections:

## [Attributes](./attribute-types/README.md) - API documentation for possible datatype attributes

- [Boolean](./boolean.md)
- [Date Only](./dateonly.md)
- [Date Time](./datetime.md)
- [Enumerate](./enum.md)
- [Integer](./integer.md)
- [Number](./number.md)
- [String](./string.md)
- [Text](./text.md)
- [UUID](./uuid.md)

## [Relationships](./relationship-types/README.md) - API documentation for possible schema relationship types

- [Belongs To](./belongs-to.md)
- [Has Many](./has-many.md)
- [Has Many Through](./has-many-through.md)
- [Has One](./has-one.md)

## [Naming](./naming.md) - Documentation describing the relationship between the names in the schema and the resulting tables, API services, & UI

- [General Guidelines](#general-guidelines)
  - [Casing](#casing)
  - [Singular vs Plural](#singular-vs-plural)
- [Schema](#schema)
  - [name](#name)
  - [pluralName](#pluralname)
  - [tableName](#tablename)
  - [namespace](#namespace-postgres-only)
  - [id](#id)
  - [displayAttribute](#displayattribute)
  - [attributes](#attributes)
  - [relationships](#relationships)

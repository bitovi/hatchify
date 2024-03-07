# Hatchify Schema

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

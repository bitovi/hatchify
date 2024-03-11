# Hatchify Schema

Hatchify provides its own interface for defining your data, called "schemas". The documentation for this interface is split into the following sections:

## [Attributes](./attribute-types/README.md) - API documentation for possible datatype attributes

- [Boolean](./attribute-types/boolean.md)
- [Date Only](./attribute-types/dateonly.md)
- [Date Time](./attribute-types/datetime.md)
- [Enumerate](./attribute-types/enum.md)
- [Integer](./attribute-types/integer.md)
- [Number](./attribute-types/number.md)
- [String](./attribute-types/string.md)
- [Text](./attribute-types/text.md)
- [UUID](./attribute-types/uuid.md)

## [Relationships](./relationship-types/README.md) - API documentation for possible schema relationship types

- [Belongs To](./relationship-types/belongs-to.md)
- [Has Many](./relationship-types/has-many.md)
- [Has Many Through](./relationship-types/has-many-through.md)
- [Has One](./relationship-types/has-one.md)

## [Naming](./naming.md) - Documentation describing the relationship between the names in the schema and the resulting tables, API services, & UI

- [General Guidelines](./naming.md#general-guidelines)
  - [Casing](./naming.md#casing)
  - [Singular vs Plural](./naming.md#singular-vs-plural)
- [Schema](./naming.md#schema)
  - [name](./naming.md#name)
  - [pluralName](./naming.md#pluralname)
  - [tableName](./naming.md#tablename)
  - [namespace](./naming.md#namespace-postgres-only)
  - [id](./naming.md#id)
  - [displayAttribute](./naming.md#displayattribute)
  - [attributes](./naming.md#attributes)
  - [relationships](./naming.md#relationships)

# Learn how to filter data

- [Using the Filters](#using-the-filters)
- [Query Operators](#query-operators)
- [Quick Reference Tables](#quick-reference-tables)
  - [Operators](#operators)
  - [Compatibility](#compatibility)
  - [Omitted Operators](#omitted-operators)

## Using the filters

Filter queries take the shape of: `filter[**attribute_name**][**operator**]=**value**`<br>

To use multiple queries together: `filter[**attribute_name**][**operator**]=**value**&filter[**attribute_name**][**operator**]=**value**`<br>

## Query Operators

The following operators are supported for filtering. Click on each one to see compatibility and example usage.

- [`$eq`](filter-examples.md/$eq.md)
- [`$ne`](filter-examples.md/$ne.md)
- [`$gt`](filter-examples.md/$gt.md)
- [`$gte`](filter-examples.md/$gte.md)
- [`$lt`](filter-examples.md/$lt.md)
- [`$lte`](filter-examples.md/$lte.md)
- [`$in`](filter-examples.md/$in.md)
- [`$nin`](filter-examples.md/$nin.md)
- [`$like`](filter-examples.md/$like.md)
- [`$ilike`](filter-examples.md/$ilike.md)
- [omitted operator](filter-examples.md/no-operator.md)

## Quick Reference Tables

### Operators

| Operator       | Description |
| -------------- | ----------- |
| `$eq`          | Matches values that are equal to the given value.           |
| `$ne`          | Matches values that are not equal to the given value.       |
| `$gt`          | Matches if values are greater than the given value.         |
| `$gte`         | Matches if values are greater or equal to the given value.  |
| `$lt`          | Matches if values are less than the given value.            |
| `$lte`         | Matches if values are less or equal to the given value.     |
| `$in`          | Matches any of the values in an array.                      |
| `$nin`         | Matches none of the values specified in an array.           |
| `$like`        | %foo → ends with foo<br>foo% → starts with<br>%foo% → contains<br>foo → equals     |
| `$ilike`   | %foo → ends with foo (insensitive)<br>foo% → starts with (insensitive)<br>%foo% → contains (insensitive)<br>foo → equals (insensitive)     |
| no operator    | behavior varies, see table in Omitted Operators section. |

### Compatibility

Operators will only work on specific value types  (string, number, boolean, date).

Operator         | String | Date | Boolean  | Numeric  | Arrays  |
| -------------- | :----: | :--: | :------: | :------: | :-----: |
| `$eq`          |    ✅  |  ✅  |   ✅      |   ✅     |   ❌     |
| `$ne`          |    ✅  |  ✅  |   ❌      |   ✅     |   ❌     |
| `$gt`          |    ✅  |  ✅  |   ❌      |   ✅     |   ❌     |
| `$gte`         |    ✅  |  ✅  |   ❌      |   ✅     |   ❌     |
| `$lt`          |    ✅  |  ✅  |   ❌      |   ✅     |   ❌     |
| `$lte`         |    ✅  |  ✅  |   ❌      |   ✅     |   ❌     |
| `$in`          |    ✅  |  ✅  |   ✅      |   ✅     |   ✅     |
| `$nin`         |    ✅  |  ✅  |   ✅      |   ✅     |   ✅     |
| `$like`        |    ✅  |  ✅  |   ❌      |   ❌     |   ❌     |
| `$ilike`       |    ✅  |  ❌  |   ❌      |   ❌     |   ❌     |
| no operator    |    ✅  |  ✅  |   ✅      |   ✅     |   ✅     |

### Omitted Operators

|Value Type    | Example                               | Operator Equates to |
| ------------ | ------------------------------------- | ------------------- |
string         |`filter[name]=lisa`                    |`$eq`
number         |`filter[age]=25`                       |`$eq`
date           |`filter[born]=2020-01-01`              |`$eq`
null           |`filter[score]=null`                   |`$eq`
boolean        |`filter[completed]=false`              |`$eq`
array          |`filter[name]=mike&filter[name]=brad`  |`$in (with $eq)`

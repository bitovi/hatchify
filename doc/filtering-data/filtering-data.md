# Learn how to filter data

This guide shows how to filter data with Hatchify.

- [Using the Filters](#using-the-filters)
- [Operators](#operators)
- [Compatibility](#compatibility)
- [Omitted Operators](#omitted-operators)

## Using the filters

Hatchify's middleware supports a wide variety of
filtering capabilities. For example, the following url might
find all todos whose name starts with "clean":

```curl
GET /api/todos?filter[name][$ilike]=clean%25
```

> Note: `%25` is `%` escaped.

These queries are also supported in [react-rest](../../packages/react-rest/README.md):

```ts
Todo.useAll({
  filter: {
    name: { $ilike: "clean%" },
  },
})
```

Filters can be combined across multiple properties:

```ts
Todo.useAll({
  filter: {
    name: { $ilike: "clean%" },
    severity: { $gt: 0.5 },
    user: { name: "Christina" },
  },
})
```

Filter queries take the shape of: `filter[ATTRIBUTE_NAME][OPERATOR]=VALUE`.

## Operators

The following operators are supported for filtering. Click on each one to see compatibility and example usage.

| Operator                           | Description                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`$eq`]($eq.md)                    | Matches values that are equal to the given value.                                                                                      |
| [`$ne`]($ne.md)                    | Matches values that are not equal to the given value.                                                                                  |
| [`$gt`]($gt.md)                    | Matches if values are greater than the given value.                                                                                    |
| [`$gte`]($gte.md)                  | Matches if values are greater or equal to the given value.                                                                             |
| [`$lt`]($lt.md)                    | Matches if values are less than the given value.                                                                                       |
| [`$lte`]($lte.md)                  | Matches if values are less or equal to the given value.                                                                                |
| [`$in`]($in.md)                    | Matches any of the values in an array.                                                                                                 |
| [`$nin`]($nin.md)                  | Matches none of the values specified in an array.                                                                                      |
| [`$like`]($like.md)                | %foo → ends with foo<br>foo% → starts with<br>%foo% → contains<br>foo → equals                                                         |
| [`$ilike`]($ilike.md)              | %foo → ends with foo (insensitive)<br>foo% → starts with (insensitive)<br>%foo% → contains (insensitive)<br>foo → equals (insensitive) |
| [omitted operator](no-operator.md) | behavior varies, see table in Omitted Operators section below.                                                                         |

## Compatibility

Operators will only work on specific value types (string, number, boolean, date).

| Operator    | String | Date | Boolean | Numeric | UUID | Arrays |
| ----------- | :----: | :--: | :-----: | :-----: | :--: | :----: |
| `$eq`       |   ✅   |  ✅  |   ✅    |   ✅    |  ✅  |   ❌   |
| `$ne`       |   ✅   |  ✅  |   ✅    |   ✅    |  ✅  |   ❌   |
| `$gt`       |   ✅   |  ✅  |   ❌    |   ✅    |  ❌  |   ❌   |
| `$gte`      |   ✅   |  ✅  |   ❌    |   ✅    |  ❌  |   ❌   |
| `$lt`       |   ✅   |  ✅  |   ❌    |   ✅    |  ❌  |   ❌   |
| `$lte`      |   ✅   |  ✅  |   ❌    |   ✅    |  ❌  |   ❌   |
| `$in`       |   ✅   |  ✅  |   ✅    |   ✅    |  ✅  |   ✅   |
| `$nin`      |   ✅   |  ✅  |   ✅    |   ✅    |  ✅  |   ✅   |
| `$like`     |   ✅   |  ❌  |   ❌    |   ❌    |  ✅  |   ❌   |
| `$ilike`    |   ✅   |  ❌  |   ❌    |   ❌    |  ✅  |   ❌   |
| no operator |   ✅   |  ✅  |   ✅    |   ✅    |  ✅  |   ✅   |

## Omitted Operators

If no operator is present, then `$eq` is used.

| Value Type | Example                                             | Operator Equates to |
| ---------- | --------------------------------------------------- | ------------------- |
| string     | `filter[name]=lisa`                                 | `$eq`               |
| number     | `filter[age]=25`                                    | `$eq`               |
| date       | `filter[born]=2020-01-01`                           | `$eq`               |
| null       | `filter[score]=%00`                                 | `$eq`               |
| boolean    | `filter[completed]=false`                           | `$eq`               |
| uuid       | `filter[uuid]=e33a8fbd-bf2f-4348-9091-8e1b6b659b69` | `$eq`               |
| array      | `filter[name]=mike&filter[name]=brad`               | `$in (with $eq)`    |

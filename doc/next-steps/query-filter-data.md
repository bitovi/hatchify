# Learn how to filter data
//todo add stuff here


## Operators
| Operator       | Description |
| -------------- | ----------- |
| `$eq`          | Matches values that are equal to the given value.      |
| `$ne`          | Matches values that are not equal to the given value.      |
| `$gt`          | Matches if values are greater than the given value.      |
| `$gte`         | Matches if values are greater or equal to the given value.       |
| `$lt`          | Matches if values are less than the given value.      |
| `$lte`         | Matches if values are less or equal to the given value.      |
| `$in`          | Matches any of the values in an array.      |
| `$nin`         | Matches none of the values specified in an array.       |
| `$like`        | %foo → ends with foo<br>foo% → starts with<br>%foo% → contains<br>foo → equals     |
| `$ilike`       | %foo → ends with foo (insensitive)<br>foo% → starts with (insensitive)<br>%foo% → contains (insensitive)<br>foo → equals (insensitive)     |
| no operator specified  | 	behavior varies, see table in Omitted Operators section.   |

## Compatibility
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

## Omitted Operators
|Value Type    | Example                               | Operator Equates to |
| ------------ | ------------------------------------- | ------------------- |
string         |`filter[name]=lisa`                    |`$eq`
number         |`filter[age]=25`                       |`$eq`
date           |`filter[born]=2020-01-01`              |`$eq`
null           |`filter[score]=null`                   |`$eq`
boolean        |`filter[completed]=false`              |`$eq`
array          |`filter[name]=mike&filter[name]=brad`  |`$in (with $eq)`


## Using the filters

Filter queries take the shape of `filter[**attribute_name**][**operator**]=**value**`<br>
All examples use this example data:

```json
    "data": [
        {
            "type": "Todo",
            "id": "1",
            "attributes": {
                "name": "Workout",
                "due_date": "2024-12-12T06:00:00.000Z",
                "importance": 6,
                "completed": false
            },
        },
        {
            "type": "Todo",
            "id": "2",
            "attributes": {
                "name": "take out trash",
                "due_date": "2023-05-09T05:00:00.000Z",
                "importance": 5,
                "completed": false
            },
        },
        {
            "type": "Todo",
            "id": "3",
            "attributes": {
                "name": "buy more icecream",
                "due_date": "2023-07-20T05:00:00.000Z",
                "importance": 9,
                "completed": true
            },
        }
    ]
```
### $eq

Records that exactly match the given value will be returned.


`filter[name][$eq]=Workout`<br>
`filter[importance][$eq]=6`<br>
`filter[due_date][$eq]=2023-07-20T05:00:00.000Z`<br>
`filter[completed][$eq]=true`<br>

### $ne

Records that do not exactly match the given value will be returned.


`filter[name][$ne]=Workout`<br>
`filter[importance][$ne]=6`<br>
`filter[due_date][$ne]=2023-07-20T05:00:00.000Z`<br>
`filter[completed][$ne]=true`<br>

### $gt

Records that are greater than the given value will be returned.


`filter[name][$gt]=Workout`<br>
`filter[importance][$gt]=6`<br>
`filter[due_date][$gt]=2023-07-20T05:00:00.000Z`<br>

### $gte

Records that are greater than the given value will be returned.


`filter[name][$gte]=Workout`<br>
`filter[importance][$gte]=6`<br>
`filter[due_date][$gte]=2023-07-20T05:00:00.000Z`<br>

### $lt

Records that are greater than the given value will be returned.


`filter[name][$gt]=Workout`<br>
`filter[importance][$gt]=6`<br>
`filter[due_date][$gt]=2023-07-20T05:00:00.000Z`<br>

### $lte

Records that are greater than the given value will be returned.


`filter[name][$lte]=Workout`<br>
`filter[importance][$lte]=6`<br>
`filter[due_date][$lte]=2023-07-20T05:00:00.000Z`<br>
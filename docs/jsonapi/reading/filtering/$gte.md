# $gte

Records that are greater than or equal to the given value will be returned.

## Compatibility

This operator is compatible with the following types:
`string`, `date`, `number`

**A note on string comparison**

Strings are compared lexicographically. Capital letters [A-Z] are smaller than lowercase [a-z]. Shorter strings are also smaller. This is similar to dictionary order.
"Workout" < "workout" > "out".

## Examples

All examples use this example data:

```json
"data": [
    {
        "type": "Todo",
        "id": "11111111-1111-1111-1111-111111111111",
        "attributes": {
            "name": "Workout",
            "dueDate": "2024-12-12",
            "importance": 6,
            "completed": false
        },
    },
    {
        "type": "Todo",
        "id": "22222222-2222-2222-2222-222222222222",
        "attributes": {
            "name": "take out trash",
            "dueDate": "2023-05-09",
            "importance": 9,
            "completed": false
        },
    },
    {
        "type": "Todo",
        "id": "33333333-3333-3333-3333-333333333333",
        "attributes": {
            "name": "buy more icecream",
            "dueDate": "2023-07-20",
            "importance": 9,
            "completed": true
        },
    }
]
```

The `dueDate` attribute is greater than or equal to `2023-07-20`<br>
`filter[dueDate][$gte]=2023-07-20`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "11111111-1111-1111-1111-111111111111",
    "attributes": {
        "name": "Workout",
        "dueDate": "2024-12-12",
        "importance": 6,
        "completed": false
    },
},
```

The `name` attribute is greater than or equal to "Workout"<br>
`filter[name][$gte]=Workout`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "11111111-1111-1111-1111-111111111111",
    "attributes": {
        "name": "Workout",
        "dueDate": "2024-12-12",
        "importance": 6,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "22222222-2222-2222-2222-222222222222",
    "attributes": {
        "name": "take out trash",
        "dueDate": "2023-05-09",
        "importance": 9,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "33333333-3333-3333-3333-333333333333",
    "attributes": {
        "name": "buy more icecream",
        "dueDate": "2023-07-20",
        "importance": 9,
        "completed": true
    },
}
```

The `name` attribute is greater than or equal to "workout"<br>
`filter[name][$gte]=workout`<br>

This filter will match no records:<br>

The `name` attribute is greater than or equal to "buy more icecream"<br>
`filter[name][$gte]=buy%20more%20icecream`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "22222222-2222-2222-2222-222222222222",
    "attributes": {
        "name": "take out trash",
        "dueDate": "2023-05-09",
        "importance": 9,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "33333333-3333-3333-3333-333333333333",
    "attributes": {
        "name": "buy more icecream",
        "dueDate": "2023-07-20",
        "importance": 9,
        "completed": true
    },
}
```

The `name` attribute is greater than or equal to "Buy more icecream"<br>
`filter[name][$gte]=buy more icecream`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "11111111-1111-1111-1111-111111111111",
    "attributes": {
        "name": "Workout",
        "dueDate": "2024-12-12",
        "importance": 6,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "22222222-2222-2222-2222-222222222222",
    "attributes": {
        "name": "take out trash",
        "dueDate": "2023-05-09",
        "importance": 9,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "33333333-3333-3333-3333-333333333333",
    "attributes": {
        "name": "buy more icecream",
        "dueDate": "2023-07-20",
        "importance": 9,
        "completed": true
    },
}
```

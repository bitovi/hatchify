# $gt

Records that are greater than the given value will be returned.

## Compatibility

This operator is compatible with the following types:
`string`, `date`, `number`

** A note on string comparison **

Strings are compared lexicographically. Capital letters [A-Z] are smaller than lowercase [a-z]. Shorter strings are also smaller. This is similar to dictionary order.
"Workout" < "workout" > "out".

## Examples

All examples use this example data:

```json
"data": [
    {
        "type": "Todo",
        "id": "1",
        "attributes": {
            "name": "Workout",
            "dueDate": "2024-12-12T06:00:00.000Z",
            "importance": 6,
            "completed": false
        },
    },
    {
        "type": "Todo",
        "id": "2",
        "attributes": {
            "name": "take out trash",
            "dueDate": "2023-05-09T05:00:00.000Z",
            "importance": 9,
            "completed": false
        },
    },
    {
        "type": "Todo",
        "id": "3",
        "attributes": {
            "name": "buy more icecream",
            "dueDate": "2023-07-20T05:00:00.000Z",
            "importance": 9,
            "completed": true
        },
    }
]
```

The `importance` attribute is greater than `6`<br>
`filter[importance][$gt]=6`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "2",
    "attributes": {
        "name": "take out trash",
        "dueDate": "2023-05-09T05:00:00.000Z",
        "importance": 9,
        "completed": false
    },
},
{
    "type": "Todo",
    "id": "3",
    "attributes": {
        "name": "buy more icecream",
        "dueDate": "2023-07-20T05:00:00.000Z",
        "importance": 9,
        "completed": true
    },
}
```

The `name` attribute is greater than "take"<br>
`filter[name][$gt]=take`<br>

This filter will match the following records:<br>

```json
{
    "type": "Todo",
    "id": "2",
    "attributes": {
        "name": "take out trash",
        "dueDate": "2023-05-09T05:00:00.000Z",
        "importance": 9,
        "completed": false
    },
},
```

The `name` attribute is greater than "take out trash"<br>
`filter[name][$gt]=take%20out%20trash`<br>

This filter will match no records.

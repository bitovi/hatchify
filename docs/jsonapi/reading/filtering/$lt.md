# $lt

Records that are less than the given value will be returned.

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

The `importance` attribute is less than `9`<br>
`filter[importance][$lt]=9`<br>

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

The `name` attribute is less than "take"<br>
`filter[name][$lt]=take`<br>

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
            "id": "33333333-3333-3333-3333-333333333333",
            "attributes": {
                "name": "buy more icecream",
                "dueDate": "2023-07-20",
                "importance": 9,
                "completed": true
            },
        }
```

The `name` attribute is less than "Take out trash"<br>
`filter[name][$lt]=Take%20out%20trash`<br>

This filter will match no records:<br>

The `name` attribute is less than "take out trash"<br>
`filter[name][$lt]=take`<br>

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
            "id": "33333333-3333-3333-3333-333333333333",
            "attributes": {
                "name": "buy more icecream",
                "dueDate": "2023-07-20",
                "importance": 9,
                "completed": true
            },
        }
```

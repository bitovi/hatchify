# $in

Records that are an exact match to any of the given values will be returned.

## Compatibility

This operator is compatible with the following types:
`string`, `date`, `boolean`, `number`, `arrays`, `uuid`

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

The `name` attribute is equal to either "Workout" or "take out trash"<br>
`filter[name][$in]=Workout&filter[name][$in]=take%20out%20trash`<br>

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
```

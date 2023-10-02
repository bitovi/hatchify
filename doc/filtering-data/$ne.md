# $ne

Records that do not exactly match the given value will be returned. This is case-sensitive.

## Compatibility

This operator is compatible with the following types:
`string`, `date`, `number`

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

The `dueDate` attribute does not equal `2023-07-20T05:00:00.000Z`<br>
`filter[dueDate][$ne]=2023-07-20T05:00:00.000Z`<br>

This filter will match the following records:<br>

```json
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
```

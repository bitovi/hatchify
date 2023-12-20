# $ilike

Similar to [$like](./$like.md), except case insensitive.<br>
Records that contain the specified values. Using the `%` wildcard will determine how this filter operater functions.<br>

- `%value` <-- value exists at the end of the record attribute<br>
- `value%` <-- value exists at the beginning of the record attribute<br>
- `%value%` <-- value exists anywhere in the record attribute<br>
- `value` <-- record attribute matches the exact value. Functionally the same as `%eq` except it is case insensitive.

## Compatibility

This operator is compatible with the following types:
`string`, `UUID`

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

The `name` attribute starts with "worko"<br>
`filter[name][$ilike]=worko%25`<br>

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
```

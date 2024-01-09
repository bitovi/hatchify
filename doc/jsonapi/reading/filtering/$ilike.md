# $ilike

Similar to [$like](./$like.md), except case insensitive.<br>
Records that contain the specified values. Using the `%` wildcard will determine how this filter operater functions.<br>

- `%value` <-- value exists at the end of the record attribute<br>
- `value%` <-- value exists at the beginning of the record attribute<br>
- `%value%` <-- value exists anywhere in the record attribute<br>
- `value` <-- record attribute matches the exact value. Functionally the same as `%eq` except it is case insensitive.

## Compatibility

This operator is compatible with the following types:
`string`, `uuid`

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

The `name` attribute starts with "worko"<br>
`filter[name][$ilike]=worko%25`<br>

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

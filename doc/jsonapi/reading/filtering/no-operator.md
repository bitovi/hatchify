# Ommitted Operator

Omitting operators from the filter query equates to using `$eq`

## Compatibility

This operator is compatible with the following types:
`string`, `date`, `boolean`, `number`, `arrays`

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

### String type

The `name` attribute is equal to "Workout"<br>
`filter[name]=Workout`<br>

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

### Number type

The `importance` attribute is equal to 9<br>
`filter[importance]=9`<br>

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
```

### Date type

The `dueDate` attribute is equal to `2023-07-20`<br>
`filter[dueDate]=2023-07-20`<br>

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

### Boolean type

The `completed` attribute is equal to true<br>
`filter[completed]=true`<br>

This filter will match the following records:<br>

```json
{
  "type": "Todo",
  "id": "33333333-3333-3333-3333-333333333333",
  "attributes": {
    "name": "buy more icecream",
    "dueDate": "2023-07-20",
    "importance": 9,
    "completed": true
  }
}
```

### Array type

Arrays can be specified by using repeating query parameters
The `importance` attribute is equal to 9 or 6<br>
`filter[importance]=9&filter[importance]=6`<br>

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

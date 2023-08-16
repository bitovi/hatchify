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
                "importance": 9,
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

### String type

The `name` attribute is equal to "Workout"<br>
`filter[name]=Workout`<br>

This filter will match the following records:<br>

```json

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
```

### Number type

The `importance` attribute is equal to 9<br>
`filter[importance]=9`<br>

This filter will match the following records:<br>

```json


        {
            "type": "Todo",
            "id": "2",
            "attributes": {
                "name": "take out trash",
                "due_date": "2023-05-09T05:00:00.000Z",
                "importance": 9,
                "completed": false
            },
        },
```

### Date type

The `due_date` attribute is equal to `2023-07-20T05:00:00.000Z`<br>
`filter[due_date]=2023-07-20T05:00:00.000Z`<br>

This filter will match the following records:<br>

```json

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
            "id": "3",
            "attributes": {
                "name": "buy more icecream",
                "due_date": "2023-07-20T05:00:00.000Z",
                "importance": 9,
                "completed": true
            },
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
                "importance": 9,
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
```

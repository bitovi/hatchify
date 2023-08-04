# $lte

Records that are less than or equal to the given value will be returned.

## Compatibility

This operator is compatible with the following types:
 `string`, `date`,  `number`

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

The `importance` attribute is less than or equal to `9`<br>
`filter[importance][$lte]=9`<br>

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

The `name` attribute is less than or equal to "take out trash"<br>
`filter[name][$lt]=take out trash`<br>

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

The `name` attribute is less than "Take out trash"<br>
`filter[name][$lte]=Take out trash`<br>

This filter will match no records:<br>

The `name` attribute is less than or equal to "Workout"<br>
`filter[name][$lte]=Workout`<br>

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

The `name` attribute is less than or equal to "workout"<br>
`filter[name][$lte]=workout`<br>

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

# string({min, max, references, default, required})

Defines an attribute as being a string type.

```ts
export const Todo = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
  },
} satisfies PartialSchema
```

## Parameters

| key                              | description                                                                                                                                |   type    | optional | default |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | :-------: | :------: | :-----: |
| `default`                        | The default value of the attribute. <br/> Example: `string({default: "USA"})`                                                              | `String`  |   Yes    |         |
| `max`                            | The maximum number of characters allowed. <br/> Example: `string({max: 1023})`                                                             | `Number`  |   Yes    |  `255`  |
| `min`                            | The maximum number of characters allowed. <br/> Example: `string({min: 5})`                                                                | `Number`  |   Yes    |   `0`   |
| `readOnly`                       | If the attribute cannot be updated.                                                                                                        | `Boolean` |   Yes    | `false` |
| `required`                       | If the attribute must be provided.                                                                                                         | `Boolean` |   Yes    | `false` |
| `ui.enableCaseSensitiveContains` | Adds an option to filter results with case sensitivity.                                                                                    | `Boolean` |   Yes    | `false` |
| `ui.displayName`                 | The display name of the attribute. By default, the Camel Case attribute name will be used. <br/> Example: `string({displayName: "Name"})`  | `String`  |   Yes    | `null`  |
| `ui.maxDisplayLength`            | The maximum number of characters to display in the UI. By default, there is no max length. <br/> Example: `string({maxDisplayLength: 50})` | `Number`  |   Yes    | `null`  |
| `ui.hidden`                      | If the attribute should be hidden in the UI. <br/> Example: `string({hidden: true})`                                                       | `Boolean` |   Yes    | `false` |

### 💾 Database Implications

The `string` type will create a sequelize [DataTypes.STRING](https://sequelize.org/docs/v6/core-concepts/model-basics/#strings) column.

### ↔️ API Implications

**_Querying Data_**

If `required` is `false`, filtering `null` values is handled like the following:

```js
GET /api/todos?filter[name]=foo // all todos with name foo

GET /api/todos?filter[name]=%00 // all todos with null as the name value

GET /api/todos?filter[name]=null // all todos with "null" as the name value
```

**_Data Response_**

String data will be returned as a string value or `null` as follows:

```js
{
  data: {
    ...
    attributes: {
      name: "foo" // or null
    }
  }
}
```

**_Mutating Data_**

When creating or updating a string attribute, string value or `null` must be provided. Any other value will return a service error.

```js
POST /api/todos

DATA:

{
  data: {
    ...
    attributes: {
      name: "STRING VALUE" // or null
    }
  }
}
```

## Data Grid Behavior

The string value in its entirety is shown. Null values and empty string values are shown as an empty table cell.

![Data Grid Example](https://github.com/bitovi/hatchify/assets/109013/9e67c44d-11c2-434e-9bcc-68cefbfc3f95)

## Form Behavior 🛑

`string()` with `max` of 255 and less will produce a standard text input like: `<input type=text>`.

`string()` with `max` of 256 and more will show a : `<textarea>`.

If `required` is `false`, empty strings will be treated as `null` values.

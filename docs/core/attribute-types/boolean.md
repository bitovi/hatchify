# boolean({default, required})

Defines an attribute as being a boolean.

```ts
export const Todo = {
  name: "Todo",
  attributes: {
    complete: boolean({ required: true }),
  },
} satisfies PartialSchema
```

## Parameters

| key              | description                                                                                                                                       |   type    | optional | default |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | :-------: | :------: | :-----: |
| `default`        | The default value of the attribute. <br/> Example: `boolean({default: true})`                                                                     | `Boolean` |   Yes    |         |
| `required`       | If the attribute must be provided. <br/> Example: `boolean({required: true})`                                                                     | `Boolean` |   Yes    | `false` |
| `ui.displayName` | The display name of the attribute. By default, the Camel Case attribute name will be used. <br/> Example: `boolean({displayName: "Is Complete"})` | `String`  |   Yes    | `null`  |
| `ui.hidden`      | If the attribute should be hidden in the UI. <br/> Example: `boolean({hidden: true})`                                                             | `Boolean` |   Yes    | `false` |

### 💾 Database Implications

The `boolean` type will create a sequelize [DataTypes.BOOLEAN](https://sequelize.org/docs/v6/core-concepts/model-basics/#boolean) column.

### ↔️ API Implications

\*\*\_

For booleans, use `true`, `false`, and `%00` in your queries as follows:

```js
GET /api/todos?complete=true // all complete todos

GET /api/todos?complete=%00 // all todos with null as the complete value 🛑

GET /api/todos?complete=false // all false todos
```

Any other value will return a service error.

Checkout the [compatibility table](../../jsonapi/reading/filtering/README.md#compatibility)) for what operators can be used with booleans.

**_Data Response_**

Boolean data will be returned as `true`, `false`, or `null` as follows:

```js
{
  data: {
    ...
    attributes: {
      complete: true
    }
  }
}
```

**_Mutating Data_**

When creating or updating a boolean attribute, `true`, `false`, or `null` must be provided. Any other value will return a service error.

## React Rest Behavior

Similar to the API, you MUST provide react rest models a `true`, `false`, or `null` value. Likewise, they will always return these values:

```ts
Todo.createOne({ attributes: { complete: true } })

const [todo, todoMeta] = hatchedReactRest.Todo.useOne({ id })
todo.complete //-> true, false or null
```

## Data Grid Behavior

The text `true` or `false` will be presented in the data grid. If the value is `null`, no value will be presented in the data grid.

![Data Grid Example](https://github.com/bitovi/hatchify/assets/78602/ddbf26a1-180b-4fc7-a483-fde52dc4fce9)

## Form Behavior 🛑

`boolean()` will produce a [`<input type=checkbox>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox) control. `null` will be treated as unchecked.

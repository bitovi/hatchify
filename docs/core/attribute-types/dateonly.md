# dateonly({min, max, default, primary, unique, required})

Defines an attribute as being a date type that does not include the **time**.

```ts
export const Todo = {
  name: "Todo",
  attributes: {
    dueDate: dateonly({ required: true }),
  },
} satisfies PartialSchema
```

Use [datetime](./datetime.md) for a date type with time.

## Parameters

| key        | description                                                                                          |      type      | optional |   default   |
| ---------- | ---------------------------------------------------------------------------------------------------- | :------------: | :------: | :---------: |
| `default`  | The default value of the attribute. <br/> Example: `dateonly({default: 2023-10-02})`                 |     `Date`     |   Yes    | `undefined` |
| `required` | If the attribute must be provided. <br/> Example: `dateonly({required: true})`                       |   `Boolean`    |   Yes    |   `false`   |
| `primary`  | If the attribute is a primary key. <br/> Example: `dateonly({primary: true})`                        |   `Boolean`    |   Yes    |   `false`   |
| `unique`   | If the attribute must be unique. <br/> Example: `dateonly({unique: true})`                           |   `Boolean`    |   Yes    |   `false`   |
| `max`      | The max date allowed. <br/> Example: `dateonly({max: new Date()})`, `dateonly({max: 1696283660000})` | `Date, number` |   Yes    | `undefined` |
| `min`      | The min date allowed. <br/> Example: `dateonly({min: new Date()})`, `dateonly({min: 1696283660000})` | `Date, number` |   Yes    | `undefined` |

**_Database Implications_**

The `dateonly` type will create sequelize [DataTypes.DATEONLY](https://sequelize.org/docs/v6/core-concepts/model-basics/#dates) column.

**_API Implications_**

This has no effect on the API

**_Querying Data_**

For dates, use a `1990-12-31` value, in your queries as follows:

```js
GET /api/todos?filter[dueDate][$eq]=2023-12-01 // all todos with a due date that matches 2023-12-01

GET /api/todos?filter[dueDate][$gte]=2023-12-01 // all todos that are on or after 2023-12-01
```

Any other value type will return a service error.

Checkout the [compatibility table](../../filtering-data/README.md#compatibility) for what operators can be used with dates

**_Data Response_**

Dateonly data will be returned as `1990-12-31`, or `null` as follows:

```js
{
  data: {
    ...
    attributes: {
      ...
      dueDate: "1990-12-31"
    }
  }
}
```

**_Mutating Data_**

When creating or updating a dateonly attribute, a valid date in the form of `1990-12-31T06:00:00.000Z`, `1990-12-31`, or `null` must be provided. Any other value type will return a service error.

Note: Any time portion used in creating/updating the attribute will be truncated.

## React Rest Behavior

Similar to the API, you MUST provide react rest models a valid date in the form of `1990-12-31T06:00:00.000Z`, `1990-12-31`, or `null` value. Likewise, they will always return these values:

```ts
Todo.createOne({ attributes: { dueDate: "1990-12-31" } })

const [todo, todoMeta] = hatchedReactRest.Todo.useOne({ id })
todo.dueDate //-> "1990-12-31", null, or undefined
```

## Data Grid Behavior

The text date values will be presented in the data grid. If the value is `null` or `undefined`, no value will be presented in the data grid.

![Data Grid Example](../../attachments/dateonly-column.png)

Note: The displayed values will be formatted to your locale.

## Form Behavior 🛑

`dateonly()` in a [`<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) control with day resolution.

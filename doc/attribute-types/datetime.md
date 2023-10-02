# datetime({min, max, default, required, step})

Defines an attribute as being a date type that includes the __time__.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    dueDate: datetime({ required: true }),
  }
}
```

Use [dateonly] for a date type without time.

## Parameters

- `default` [{ISODateString | DateNumber | Date}] - The default value of the attribute.  Example: `datetime({default: '2023-10-02T21:16:15.349Z'})`
- `max` [{ISODateString | DateNumber | Date = Infinity}] - The maximum date allowed. Defaults to allowing any maximum date.

  `max` can be set to an `ISODateString`. Example: `datetime({max: '2023-10-02T21:16:15.349Z'})`.

  `max` can be set to an `DateNumber`. Example: `datetime({max: 1696283660000})`.

  `max` can be set to a `Date`. Example: `datetime({max: new Date()})`.

- `min` [{ISODateString | DateNumber | Date = Infinity}] - The minimum date allowed. Defaults to allowing any minimum date.

  `min` can be set to an `ISODateString`. Example: `datetime({min: '2023-10-02T21:16:15.349Z'})`.

  `min` can be set to an `DateNumber`. Example: `datetime({min: 1696283660000})`.

  `min` can be set to a `Date`. Example: `datetime({min: new Date()})`.

- `required` [{Boolean=false}] - If the attribute must be provided.

- 🛑 `step` [DateStepNumber | DateStepString = "minute"] - How far apart dates need to be. 

  `step` can be set to a `DateStepString` value of `"second"`, `"minute"`, `"hour"`, `"day"`, `"week"`, `"month"`, `"year"`.

  `step` can be set to a `DateStepNumber` that specifies the spacing between dates in miliseconds. For example, the following
  sets the step size to allow dates every other hour: `datetime({step: 1000*60*60*2})`

## Form Controls

`datetime()` will result in a [`<input type="datetime-local">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local) control
with minute resolution.

`datetime({step: "day"})` in a [`<input type="date">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) control with day resolution.

`datetime({step: "week"})` in a [`<input type="week">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week) control with week resolution.

`datetime({step: "month"})` in a [`<input type="month">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month) control with month resolution.

`datetime({step: "month"})` in a [`<input type="month">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month) control with month resolution.

Currently, any other step value will result in a [`<input type="datetime-local">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local) control which will be validated after the value is set.



<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "Date",
  allowNull: Boolean, 
  min: ISODateString | -Infinity,
  max: ISODateString | Infinity,
  step: DateStepNumber | DateStepString
}
```


### Sequelize Type

If `step="day"`:

```js
{
  type: "DATEONLY",
  typeArgs: [],
  allowNull: Boolean
}
```

Else:

```js
{
  type: "DATE",
  typeArgs: [],
  allowNull: Boolean
}
```


  
</details>


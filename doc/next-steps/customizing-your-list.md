# [UPDATE IMAGES ]

<!-- ![image](https://github.com/bitovi/hatchify/assets/2623867/f4444c37-e77d-44f8-bda0-0356efe6600d) -->

# Customizing your list

Hatchify gives you the option to customize your lists with two compound components that can be nested within your `Collection`: `Column`, and `Empty`.

<!-- The following guide shows how to customize what is displayed if there are no items in a list. We will extend the getting started guide to show a nice empty list message as shown below: -->

Let's start with `Empty`.

## `Empty`

### Code

Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas"

export const hatchedReact = hatchifyReact(createJsonapiClient("http://localhost:3000/api", schemas))

const TodoList = hatchedReact.components.Todo.Collection // 👀
const TodoEmpty = hatchedReact.components.Todo.Empty // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          <TodoEmpty>
            <strong>There are no todos. Time to take a break!</strong> {/*👀*/}
          </TodoEmpty>
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

### How it works

- We need a reference to the `Todo.Empty` component. The following aliases it to make it easier to reference:

  ```tsx
  const TodoEmpty = hatchedReact.components.Todo.Empty
  ```

- The `<TodoEmpty>` component specifies the content that should be displayed when the list is empty. Put the empty list content within `<TodoEmpty>` and put `<TodoEmpty>` within the `<TodoList>` component:

  ```tsx
  <TodoList>
    <TodoEmpty>
      <strong>There are no todos. Time to take a break!</strong>
    </TodoEmpty>
  </TodoList>
  ```

## Column

`Column` is a powerful compound component that allows you to make fine-grained customizations to your list. It can be used to make selective changes and additions to your list as-is, or it can be used to fully override your Hatchify list.

`Column`s come in three types: `replace`, `prepend`, and `append`.

Let's start with the `replace` column. We'll use it to make selective changes and additions to our list, while letting Hatchify render the rest of our list as it normally would:

### `replace`

#### Code

Update `/src/App.tsx` to the following:

```jsx
// hatchify-app/frontend/App.tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas"

export const hatchedReact = hatchifyReact(createJsonapiClient("http://localhost:3000/api", schemas))

const TodoList = hatchedReact.components.Todo.Collection
const TodoEmpty = hatchedReact.components.Todo.Empty
const TodoColumn = hatchedReact.components.Todo.Column

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          <TodoEmpty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoEmpty>
          <TodoColumn
            type="replace"
            field="name"
            label="Task name"
            renderDataValue={({ value }) => <strong>{value}</strong>}
            renderHeaderValue={({ label }) => <strong>{label}</strong>}
            sortable={true}
          />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

#### How it works

- The `type` prop specifies how our column is supposed to affect our Hatchify list. `"replace"` instructs Hatchify to _only_ apply our changes to the column that corresponds to the value of the `field` prop--in this case, `"name"`.
- The `label` prop allows us to overwrite the column's header with a custom string.
- The `renderDataValue` prop allows us to pass in a callback that returns JSX. That JSX will fully overwrite the contents of each data cell. The callback accepts one argument: an object with a `value` property and a `record` property. `value` is equal to the value that would have otherwise been output to each data cell (if we weren't using `renderDataValue` to override it). `record` is equal to the full record represented by a given data cell's row--if, for example, you wanted your custom column's data cells to render a computed value that requires values from multiple attributes on your record, you can access all of them from `record`!
  - Alternatively, you could use `DataValueComponent` prop instead of `renderDataValue`. It does the same thing, but instead of accepting a callback, it accepts a React component that optionally accepts a `record` prop and a `value` prop.
- The `renderHeaderValue` prop works just like `renderDataValue`, only the JSX returned by the callback will fully overwrite the contents of the header cell. [explain the API here]
  - Alternatively, you could use `HeaderValueComponent` prop instead of `renderHeaderValue`. Instead of accepting a callback, it accepts a React component that optionally accepts a [list out props].
- The `sortable` prop tells Hatchify whether or not to render the default column sorting UI in the column's header cell. It defaults to `true` as long as your `field` prop specifies a valid attribute on your schema, so in our case it's redundant to include it as we have--we just did so for demonstration purposes. An example use case for setting `sortable` to `false` would be if you wanted to handle the sorting UI yourself through the `renderHeaderValue` prop.

Okay! We just learned how to selectively modify an existing column--now let's try adding brand new columns to our list.

### `prepend` & `append`

#### Code

Update `/src/App.tsx` to the following:

```jsx
// hatchify-app/frontend/App.tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas"

export const hatchedReact = hatchifyReact(createJsonapiClient("http://localhost:3000/api", schemas))

const TodoList = hatchedReact.components.Todo.Collection
const TodoEmpty = hatchedReact.components.Todo.Empty
const TodoColumn = hatchedReact.components.Todo.Column

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          <TodoEmpty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoEmpty>
          <TodoColumn
            type="append"
            label="Actions"
            renderDataValue={({record}) => <button onClick={alert(`${record.id}`)}>View id</button>}
          />
          <TodoColumn
            type="replace"
            field="name"
            label="Task name"
            renderDataValue={({ value }) => <strong>{value}</strong>}
            renderHeaderValue={({ label }) => <strong>{label}</strong>}
            sortable={true}
          />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

#### How it works

- Columns with a `type` of `append` will always appear at the end of your list (even if you included it _before_ a `replace` column, like we did above).
  - The order in which you include `append` columns only matters relative to _each other_, so the first and second `append` columns that you include will always appear at the end of your list, _in that order_.
- We removed the `field` prop because `append` columns represent brand new columns that inherently don't map directly to an attribute on our schema--fear not though, we still have access to the entire row's `record` object via `renderDataCell`, so we can still use any values off our record that we need.
- The last `type` value that we haven't covered is `prepend`, and it does exactly what you'd think: it behaves the same as `append`, only the columns will appear at the _beginning_ of your list instead of at the end.

In all three of the `type` values we just covered -- `replace`, `append`, and `prepend` -- you'll notice that as we made changes to our table, Hatchify continued to render all the other columns of our table that we _didn't_ modify, just as it normally would. So now let's take a look at how we can override Hatchify's column-rendering behavior completely!

### Override mode

#### Code

Update `/src/App.tsx` to the following:

```jsx
// hatchify-app/frontend/App.tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas"

export const hatchedReact = hatchifyReact(createJsonapiClient("http://localhost:3000/api", schemas))

const TodoList = hatchedReact.components.Todo.Collection
const TodoEmpty = hatchedReact.components.Todo.Empty
const TodoColumn = hatchedReact.components.Todo.Column

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          <TodoEmpty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoEmpty>
          <TodoColumn
            type="append"
            label="Actions"
            renderDataValue={({record}) => <button onClick={alert(`${record.id}`)}>View id</button>}
          />
          <TodoColumn
            type="replace"
            field="name"
            label="Task name"
            renderDataValue={({ value }) => <strong>{value}</strong>}
            renderHeaderValue={({ label }) => <strong>{label}</strong>}
            sortable={true}
          />
          <TodoColumn
            label="Override column"
            renderDataValue={({ record }) => <strong>{record.name}</strong>}
            renderHeaderValue={({ label }) => <strong>{label}</strong>}
          />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

What happened to the rest of our columns!? They're gone! Don't worry--this is by design:

#### How it works

- As soon as you add a column without a `type` prop, Hatchify has no way of knowing how that column is supposed to fit in with the rest of the columns it would normally render. So instead, it renders none of them and will only render columns that you add without a `type` prop, or with a `type` prop equal to `append` or `prepend`.
- An example use case for this feature is a table that needs to be heavily customized; you might need all the data on your records, but each column requires computed values or needs to be in a custom order, etc.
- We didn't include the `field` prop in our example, but `type`-less columns will still accept it. If, for example, you wanted a list that only renders _some_ of it's usual columns, you could simply add a `type`-less column for each and set the `field` prop to the corresponding attribute. The columns will then render exactly as normal, only none of the columns that you _didn't_ specify will render.
- Obviously in a case like this you'd want to remove any `replace` columns you have, but we kept them in the code above to demonstrate that they won't render as long as you have even a single `type`-less column.

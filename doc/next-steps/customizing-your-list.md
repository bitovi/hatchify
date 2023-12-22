# [UPDATE IMAGES ]

<!-- ![image](https://github.com/bitovi/hatchify/assets/2623867/f4444c37-e77d-44f8-bda0-0356efe6600d) -->

# Customizing your list

Hatchify gives you the option to customize your list with two compound components that can be nested within your `Collection` component: `Column`, and `Empty`.

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
          {" "}
          {/*👀*/}
          <TodoEmpty>
            {" "}
            {/*👀*/}
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

And that's all there is to it. Next, lets explore `Column`, which offers a lot more customization.

## Column

`Column` is a powerful compound component that allows you to make fine-grained customizations to your list. It can be used to make selective changes and additions, or it can be used to override your list entirely.

The behavior of a `Column` is largely determined by the value passed into its `type` prop: `replace`, `prepend`, and `append`. You can also omit the `type` prop entirely, but we'll get to that later.

Let's start with the `replace` type. We'll use it to make selective changes and additions to our list, while letting Hatchify render the rest of our list as it normally would:

### `type="replace"`

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
            label="To Do"
            renderDataValue={({ value }) => <strong>{value}</strong>}
            renderHeaderValue={({ label }) => <>Things I need {label}</>}
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

- Just like `Todo.Empty`, we need a reference to the `Todo.Column` component. The following aliases it to make it easier to reference:

  ```tsx
  const TodoColumn = hatchedReact.components.Todo.Column
  ```

- Setting the `type` prop to `replace` instructs Hatchify to render all the usual columns in our list, while _only_ applying our customizations to the column that corresponds to the value of the `field` prop on our `Column`.

  ```tsx
  type = "replace"
  field = "name"
  ```

- The `label` prop allows us to overwrite the column's default header with a custom string.

  ```tsx
  Label = "To Do"
  ```

- The `renderDataValue` prop allows us to pass in a callback that returns JSX. That JSX will fully overwrite the contents of each data cell.

  ```tsx
  renderDataValue={({ value }) => <strong>{value}</strong>}
  ```

  The callback accepts one argument: an object with a `value` property and a `record` property. `value` is equal to the value that would have otherwise been rendered in each data cell. `record` is equal to the full record represented by a given data cell's row--for example: if you wanted your column's data cells to render a computed value that requires values from multiple values on your record, you can access all of them from `record`.

  - Alternatively, you could use `DataValueComponent` prop instead of `renderDataValue`. It does the same thing, but instead of accepting a callback, it accepts a React component that optionally accepts a `record` prop and a `value` prop. It would look something like this:

    ```tsx
    // Define your component:
    const CustomComponent = ({ value }: { value: string }) => <strong>{value}</strong>
    ```

    ```tsx
    // Inside your column replace the `renderHeaderValue` prop with:
    DataValueComponent = { CustomComponent }
    ```

- The `renderHeaderValue` prop works just like `renderDataValue`, only the JSX returned by the callback will fully overwrite the contents of the header cell. [explain the API here]

  ```tsx
  renderHeaderValue={({ label }) => <>Things I need {label}</>}
  ```

  This example is a little contrived because the `label` we're destructuring will always be equal to the `label` prop we set on our `Column`, so we could have simply omitted the `label` prop entirely and hard-coded the value in the return of our callback. If you _don't_ set a `label` prop on your `Column`, `label` will equal the column's default label.

  - Just like `DataValueComponent`, `renderHeaderValue` accepts a `HeaderValueComponent` that works the same way.

- The `sortable` prop tells Hatchify whether or not to render the default column sorting UI in the column's header cell.

  ```tsx
  sortable={true}
  ```

It defaults to `true` as long as your `field` prop specifies a valid attribute on your schema, so in our case it's redundant to include it--we just did so for demonstration purposes. An example use case for setting `sortable` to `false` would be if you wanted to handle the sorting UI yourself through the `renderHeaderValue` prop.

Okay! We just learned how to selectively modify an existing column--now let's try adding brand new columns to our list.

### `type="prepend|append"`

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
          <TodoColumn
            type="append"
            label="Actions"
            renderDataValue={({record}) => <button onClick={alert(`${record.id}`)}>View id</button>}
          />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

#### How it works

- Columns with a `type` of `append` will always appear at the end of your list (even if you include them before non-`append` columns)

  ```tsx
  type = "append"
  ```

  The order in which you include `append` columns only matters relative to _each other_.

- We removed the `field` prop because `append` columns represent brand new columns that inherently don't map directly to a field in our list. Despite this, we still have access to the entire row's `record` object via `renderDataCell`, so we can still access any fields from our record that we need.
- If we want our column to appear at the beginning of our list, we can set our `type` to `prepend` instead.

With all three of the `type` values we just covered -- `replace`, `append`, and `prepend` -- you'll notice that as we made changes to our list, Hatchify continued to render all the other columns that we _didn't_ modify just as it normally would. So now let's take a look at how we can override Hatchify's column-rendering behavior completely.

### Fully overriding your list's columns

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

- As soon as you add a column without a `type` prop, Hatchify has no way of knowing where that column is supposed to fit in with the rest of the columns it would normally render. So instead it renders none of them, and will only render columns that you add without a `type` prop, or with a `type` prop equal to `append` or `prepend`.
- An example use case for this feature is a list that needs to be heavily customized; you might need all the fields on your records in order to populate your list, but each column requires computed values or needs to be in a custom order, etc.
- We didn't include the `field` prop in our example, but `type`-less columns will still accept it. If, for example, you wanted a list that only renders columns for _some_ of it's fields, you could simply add a `type`-less column for each and set the `field` prop to the corresponding attribute. Those columns will then render exactly as normal (unless you customize them further), but none of the columns that you _didn't_ specify will render.

  ```tsx
  // This will render the `name` column like normal, but columns you don't specify won't render
  <TodoColumn field="name" />
  ```

- Obviously in a case like this you'd want to remove any `replace` columns you have because Hatchify will ignore them, but we kept them in the code above for demonstration purposes.

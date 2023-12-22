# Customizing your list

Hatchify gives you the option to customize your list with two compound components that can be nested within your `Collection` component: `Column`, and `Empty`.

Let's start with `Empty`.

## `Empty`

### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

export const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoList = hatchedReact.components.Todo.Collection // 👀
const TodoEmpty = hatchedReact.components.Todo.Empty // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          {/* 👀 */}
          <TodoEmpty>
            {/* 👀 */}
            <strong>There are no todos. Time to take a break!</strong>
          </TodoEmpty>
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_ (1)](https://github.com/bitovi/hatchify/assets/60432429/427a1511-d187-4cc4-8a92-3ce8cb70b422)

Notice how the content we've placed inside `TodoEmpty` now displays in our empty list.

### How it works

- We need a reference to the `Todo.Empty` component. The following aliases it to make it easier to reference:

  ```tsx
  const TodoEmpty = hatchedReact.components.Todo.Empty
  ```

- The `<TodoEmpty>` component specifies the content that should be displayed when the list is empty. To use it, simply put the empty list content within `<TodoEmpty>` and put `<TodoEmpty>` within the `<TodoList>` component:

  ```tsx
  <TodoList>
    <TodoEmpty>
      <strong>There are no todos. Time to take a break!</strong>
    </TodoEmpty>
  </TodoList>
  ```

And that's all there is to it! Next, lets explore `Column`, which offers a lot more customization.

✏️ Before you proceed, post some seed data to your database. You can use the snippet from the [Seeding Data section in the Hatchify getting started guide](../../README.md#seeding-data) to do this.

## `Column`

`Column` is a powerful compound component that allows you to make fine-grained customizations to your list. It can be used to make selective changes and additions, or it can be used to override your list entirely.

Much of the behavior of a `Column` is determined by which value is passed into its `type` prop: `replace`, `prepend`, or `append`. You can also omit the `type` prop entirely, but we'll get to that later.

Let's start with the `replace` type. We'll use it to make selective changes and additions to our list, while letting Hatchify render the rest of our list as it normally would.

### `type="replace"`

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

export const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoList = hatchedReact.components.Todo.Collection
const TodoEmpty = hatchedReact.components.Todo.Empty
const TodoColumn = hatchedReact.components.Todo.Column // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
          <TodoEmpty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoEmpty>
          {/* 👀 */}
          <TodoColumn type="replace" field="name" label="ToDo" renderDataValue={({ value }) => <strong>{value}</strong>} renderHeaderValue={({ column: { label } }) => <strong>{label} Items</strong>} sortable={true} />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_ (2)](https://github.com/bitovi/hatchify/assets/60432429/72a0c73e-fc68-4fc2-b4a8-1f5ebc9fe44c)

Notice how the column for the `name` field has been replaced with our custom column.

#### How it works

- Just like `Todo.Empty`, we need a reference to the `Todo.Column` component. The following aliases it to make it easier to reference:

  ```tsx
  const TodoColumn = hatchedReact.components.Todo.Column
  ```

- Setting the `type` prop to `replace` instructs Hatchify to render all the usual columns in your list, while _only_ applying your customizations to the column that corresponds to the value of the `field` prop on `TodoColumn`.

  ```tsx
  type = "replace"
  field = "name"
  ```

- The `label` prop allows you to overwrite the column's default header with a custom string.

  ```tsx
  label = "ToDo"
  ```

- The `renderDataValue` prop allows you to pass in a callback that returns JSX. That JSX will fully overwrite the contents of each data cell.

  ```tsx
  renderDataValue={({ value }) => <strong>{value}</strong>}
  ```

  The callback accepts one argument: an object with a `value` property and a `record` property. `value` is equal to the value that would have otherwise been rendered in each data cell. `record` is equal to the full record represented by a given data cell's row.

  - Alternatively, you could use the `DataValueComponent` prop instead of `renderDataValue`. It does the same thing, but instead of accepting a callback it accepts a React component that optionally accepts a `record` prop and a `value` prop. It would look something like this:

    ```tsx
    // Define your component:
    const CustomComponent = ({ value }: { value: string }) => <strong>{value}</strong>
    ```

    ```tsx
    // Inside your TodoColumn, replace the `renderHeaderValue` prop with:
    DataValueComponent = { CustomComponent }
    ```

- The `renderHeaderValue` prop works just like `renderDataValue`, only the JSX returned by the callback will fully overwrite the contents of the header cell.

  ```tsx
  renderHeaderValue={({ column: { label } }) => <strong>{label} Items</strong>}
  ```

  This example is a little contrived because the `label` we're destructuring in our app code above will always be equal to the `label` prop that we set on our `Column`, so we could have simply omitted the `label` prop entirely and hard-coded the value in the return of our callback.

  Just like `renderDataValue`, `renderHeaderValue` accepts a single object as its argument, but its shape is more complex. Let's look at it in detail:

  ```tsx
    {
      column: {
        sortable, // Boolean that reflects whether or not sorting has been applied to the column
        key, // Unique key for the column
        label, // The column's label
      },
      meta, // Contains metadata, including sort request pending status
      sortBy, // The field that the list is sorted by. This will always equal the field that the column corresponds to, if applicable
      direction, // The direction that the list is currently sorted by
      setSort, // A function for updating the list's sort
    }
  ```

  - Just like `renderDataValue`, `renderHeaderValue` can be replaced with `HeaderValueComponent`, which works similarly to `DataValueComponent`.

- The `sortable` prop tells Hatchify whether or not to render the default column sorting UI in the column's header cell.

  ```tsx
  sortable={true}
  ```

  It defaults to `true` as long as your `field` prop specifies a valid field on your record, so in this case it's redundant to include it--we just did so for demonstration purposes.

  Note that if you set `sortable` to `true` on a column with an invalid `field` prop, the default column sorting UI will display but using it will send an invalid network request (because the request won't contain a valid field to sort by).

**Note**: You may have noticed that the column for the `id` field is missing. Hatchify hides it by default, but you can change this behavior by updating your schema to `id: uuid({ primary: true })`.

Okay! We just learned how to selectively modify an existing column--now let's try adding brand new columns to our list.

### `type="prepend|append"`

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

export const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

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
          {/* 👀 */}
          <TodoColumn type="append" label="Actions" renderDataValue={({ record }) => <button onClick={() => alert(`${record.id}`)}>View ID</button>} />
          <TodoColumn type="replace" field="name" label="ToDo" renderDataValue={({ value }) => <strong>{value}</strong>} renderHeaderValue={({ column: { label } }) => <strong>{label} Items</strong>} sortable={true} />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_](https://github.com/bitovi/hatchify/assets/60432429/58aaf34e-a7c2-4346-8d8d-1f4eaa31a49f)

Notice the new "Actions" column at the end of our list.

#### How it works

- Columns with a `type` of `append` will always appear at the end of your list, even if you include them before non-`append` columns (The order in which you include `append` columns only matters relative to _each other_).

  ```tsx
  type = "append"
  ```

- In our app code above, we removed the `field` prop because `append` columns represent brand new columns that inherently don't map directly to a field in our list. Despite this, we still have access to the entire row's `record` object via `renderDataCell`, so we can still access any fields from our record that we need.
- If you want your column to appear at the beginning of your list, you can set the `type` to `prepend` instead.

With all three of the `type` values we just covered--`replace`, `append`, and `prepend`--you'll notice that as we made changes to our list, Hatchify continued to render all the other columns that we _didn't_ modify as it normally would. So now let's take a look at how we can fully override Hatchify's column-rendering behavior.

### Fully overriding your list's columns

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

export const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

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
          <TodoColumn type="append" label="Actions" renderDataValue={({ record }) => <button onClick={() => alert(`${record.id}`)}>View ID</button>} />
          <TodoColumn type="replace" field="name" label="Task name" renderDataValue={({ value }) => <strong>{value}</strong>} renderHeaderValue={({ label }) => <strong>{label}</strong>} sortable={true} />
          {/* 👀 */}
          <TodoColumn label="Override column" renderDataValue={({ record }) => <strong>{record.name}</strong>} renderHeaderValue={({ column: { label } }) => <strong>{label}</strong>} />
        </TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_ (1)](https://github.com/bitovi/hatchify/assets/60432429/3066a8e3-efa2-4b7a-b199-98323df869cd)

Notice that most of our columns are no longer rendering. Don't worry--this is by design:

#### How it works

- As soon as you add a column without a `type` prop, Hatchify has no way of knowing where that column is supposed to fit in with the rest of the columns it would normally render. So instead it renders none of them, and will only render columns that you add without a `type` prop, or with a `type` prop equal to `append` or `prepend`.
- An example use case for this feature is a list that needs to be heavily customized; you might need all the fields on your records in order to populate your list, but each column requires computed values or needs to be in a custom order, etc.
- We didn't include the `field` prop in our example, but `type`-less columns will still accept it. If, for example, you wanted a list that only renders columns for _some_ of its fields, you could simply add a `type`-less column for each and set the `field` prop to the corresponding field. Those columns will then render as normal (unless you customize them further), but none of the columns that you _didn't_ specify will render.

  ```tsx
  // This will render the `name` column like normal, but columns you don't specify won't render
  <TodoColumn field="name" />
  ```

- Obviously when you fully override your Hatchify columns you'd want to remove any `replace` columns you have because Hatchify will ignore them, but we kept them in the code above for demonstration purposes.

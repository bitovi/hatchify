# Customizing your list

Hatchify gives you the option to customize your list with two compound components that can be nested within your `DataGrid` component: `DataGrid.Column`, and `DataGrid.Empty`.

Let's start with `DataGrid.Empty`.

## `DataGrid.Empty`

### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          {/* 👀 */}
          <TodoDataGrid.Empty>
            {/* 👀 */}
            <strong>There are no todos. Time to take a break!</strong>
          </TodoDataGrid.Empty>
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_ (1)](https://github.com/bitovi/hatchify/assets/60432429/427a1511-d187-4cc4-8a92-3ce8cb70b422)

Notice how the content we've placed inside `TodoDataGrid.Empty` now displays in our empty list.

### How it works

- Because the `DataGrid.Empty` component is meant to be used only within a `DataGrid`, you can access it by either appending `.Empty` to the `DataGrid`.

```tsx
const TodoEmpty = hatchedReact.components.Todo.DataGrid.Empty
```

Or you can use your existing `DataGrid` component and access `Empty` as a property of it:

```tsx
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

return <TodoDataGrid.Empty />
```

- The `<TodoDataGrid.Empty>` component specifies the content that should be displayed when the list is empty. To use it, simply put the empty list content within `<TodoDataGrid.Empty>` and put `<TodoDataGrid.Empty>` within the `<TodoDataGrid>` component:

  ```tsx
  <TodoDataGrid>
    <TodoDataGrid.Empty>
      <strong>There are no todos. Time to take a break!</strong>
    </TodoDataGrid.Empty>
  </TodoDataGrid>
  ```

And that's all there is to it! Next, lets explore `DataGrid.Column`, which offers a lot more customization.

✏️ Before you proceed, post some seed data to your database. You can use the snippet from the [Seeding Data section in the Hatchify getting started guide](../../README.md#seeding-data) to do this.

## `DataGrid.Column`

`DataGrid.Column` is a powerful compound component that allows you to make fine-grained customizations to your list. It can be used to make selective changes and additions, or it can be used to override your list entirely.

The behaviour of your `DataGrid.Column` customizations is determined by the `field` prop, as well as the `overwrite` prop on the parent `DataGrid` component. Depending on how you use the `field` prop, a `DataGrid.Column` is considered either "Extra" or "Custom". Let's start by looking at the difference between the two.

### Custom `DataGrid.Column`

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoDataGrid.Empty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoDataGrid.Empty>
          {/* 👀 */}
          <TodoDataGrid.Column
            field="name"
            label="ToDo"
            renderDataValue={({ value }) => {
              return <strong>{value}</strong>
            }}
            renderHeaderValue={({ column: { label } }) => {
              return <strong>{label} Items</strong>
            }}
            sortable={true}
          />
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Your app should now look like this:

![localhost_3000_ (2)](https://github.com/bitovi/hatchify/assets/60432429/72a0c73e-fc68-4fc2-b4a8-1f5ebc9fe44c)

Notice how the column for the `name` field has been replaced with our Custom column.

#### How it works

- Just like `Empty`, we can access `Column` by appending `.Column` to the `DataGrid` component.

```tsx
const TodoColumn = hatchedReact.components.Todo.DataGrid.Column
```

Or we can use our existing `DataGrid` component and access `Column` as a property of it:

```tsx
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

return <TodoDataGrid.Column />
```

- By setting the `field` property on our `DataGrid.Column` to `name`, we're establishing our `DataGrid.Column` as being a Custom column. What this does is tell Hatchify to apply our customizations to the column that corresponds to the `name` field on our record.

  ```tsx
  <TodoDataGrid.Column
    field="name"
    //...Remaining props...
  />
  ```

- The `label` prop allows you to overwrite the column's default header with a custom string.

  ```tsx
  <TodoDataGrid.Column
    label="ToDo"
    //...Remaining props...
  />
  ```

- The `renderDataValue` prop allows you to pass in a callback that returns JSX. That JSX will fully overwrite the contents of each data cell.

  ```tsx
  <TodoDataGrid.Column
    renderDataValue={({ value }) => {
      return <strong>{value}</strong>
    }}
    //...Remaining props...
  />
  ```

  The callback accepts one argument: an object with a `value` property and a `record` property. `value` is equal to the value that would have otherwise been rendered in each data cell. `record` is equal to the full record represented by a given data cell's row.

  - Alternatively, you could use the `DataValueComponent` prop instead of `renderDataValue`. It does the same thing, but instead of accepting a callback it accepts a React component that optionally accepts a `record` prop and a `value` prop. It would look something like this:

    ```tsx
    // Define your component:
    const CustomComponent = ({ value }: { value: string }) => {
      return <strong>{value}</strong>
    }
    ```

    ```tsx
    // Replace `renderDataValue` with `DataValueComponent` and pass in your `CustomComponent`:
    <TodoDataGrid.Column
      DataValueComponent={CustomComponent}
      //...Remaining props...
    />
    ```

- The `renderHeaderValue` prop works just like `renderDataValue`, only the JSX returned by the callback will fully overwrite the contents of the header cell.

  ```tsx
  renderHeaderValue={({ column: { label } }) => {
    return <strong>{label} Items</strong>
  }}
  ```

  This example is a little contrived because the `label` we're destructuring in our app code above will always be equal to the `label` prop that we set on our `DataGrid.Column`, so we could have simply omitted the `label` prop entirely and hard-coded the value in the return of our callback.

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
  <TodoDataGrid.Column
    sortable={true}
    //...Remaining props...
  />
  ```

  It defaults to `true` as long as your `field` prop specifies a valid field on your record, so in this case it's redundant to include it--we just did so for demonstration purposes.

  Note that if you set `sortable` to `true` on a column with an invalid `field` prop, the default column sorting UI will display but using it will send an invalid network request (because the request won't contain a valid field to sort by).

**Note**: You may have noticed that the column for the `id` field is missing. Hatchify hides it by default, but you can change this behavior by updating your schema to `id: uuid({ primary: true })`.

Okay! We just learned how to selectively modify an existing column--now let's try adding brand new columns to our list.

### Extra `DataGrid.Column`

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoDataGrid.Empty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoDataGrid.Empty>
          {/* 👀 */}
          <TodoDataGrid.Empty
            label="Actions"
            renderDataValue={({ record }) => {
              return <button onClick={() => alert(`${record.id}`)}>View ID</button>
            }}
          />
          <TodoDataGrid.Empty
            field="name"
            label="ToDo"
            renderDataValue={({ value }) => {
              return <strong>{value}</strong>
            }}
            renderHeaderValue={({ column: { label } }) => {
              return <strong>{label} Items</strong>
            }}
            sortable={true}
          />
        </TodoDataGrid>
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

- Columns without a `field` prop are treated as Extra columns and will always appear at the end of your list, even if you include them before Custom columns. In the below example, the "Actions" column will appear at the end of our table, even though it's defined before the "name" column:

  ```tsx
  <TodoDataGrid.Column
    label="Actions"
    //...Remaining props...
  />
  <TodoDataGrid.Column
    field="name"
    //...Remaining props...
  />
  ```

- In our app code above, we removed the `field` prop because Extra columns represent brand new columns that inherently don't map directly to a field in our list. Despite this, we still have access to the entire row's `record` object via `renderDataCell`, so we can still access any fields from our record that we need.
- If you want your column to appear at the beginning of your list, you can set the `prepend` prop to true.

With the two types of columns we just covered - Extra and Custom - you'll notice that when we made changes to our list, Hatchify continued to render all the other columns that we _didn't_ modify as it normally would. So now let's take a look at how we can fully override Hatchify's column-rendering behavior.

### Fully overriding your list's columns

#### Code

✏️ Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid
          {/* 👀 */}
          overwrite
        >
          <TodoDataGrid.Empty>
            <strong>There are no todos. Time to take a break!</strong>
          </TodoDataGrid.Empty>
          {/* 👀 */}
          <TodoDataGrid.Column
            label="Override column"
            renderDataValue={({ record }) => {
              return <strong>{record.name}</strong>
            }}
            renderHeaderValue={({ column: { label } }) => {
              return <strong>{label}</strong>
            }}
          />
          <TodoDataGrid.Column
            prepend
            label="Actions"
            renderDataValue={({ record }) => {
              return <button onClick={() => alert(`${record.id}`)}>View ID</button>
            }}
          />
        </TodoDataGrid>
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

- As soon as you add the `ovewrite` prop to the `DataGrid` component, Hatchify will no longer render any columns that you don't specify. This means that you'll need to add a `DataGrid.Column` component for each field that you want to render.
- An example use case for this feature is a list that needs to be heavily customized; you might need all the fields on your records in order to populate your list, but each column requires computed values or needs to be in a custom order, etc.
- When in `overwrite` mode, the order will be determined by the order of your `DataGrid.Column` components, so if you want your columns to appear in a specific order, you'll need to specify them in that order. The `prepend` prop, or absence of it, has no effect when in `overwrite` mode.

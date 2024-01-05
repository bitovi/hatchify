# Adding checkboxes to the list

This guide shows how to build and use a checklist column and integrate it with an _action_ button as shown below.

## Outcome

![image](https://github.com/bitovi/hatchify/assets/2623867/28aa4e2f-f6a0-47ca-b481-fad856ce9d35)

Users can:

1. Select records or check the "all" records button, and then
2. Click the _action_ button and be told what ids were selector and if the "all" records button was clicked.

## Code

Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas.js"
import { useState } from "react" // 👀

export const hatchedReact = hatchifyReact(createJsonapiClient("http://localhost:3000/api", schemas))

const TodoList = hatchedReact.components.Todo.DataGrid

const App: React.FC = () => {
  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    // 👀
    all: false,
    ids: [],
  })

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <button onClick={() => alert(`all: ${selected.all}, ids: ${selected.ids}`)}>action</button>
        <TodoList defaultSelected={selected} onSelectedChange={(selected) => setSelected(selected)}></TodoList>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

## How it works

- We will use the `useState` hook to store what checkboxes are checked. We need to import `useState` as follows:

  ```tsx
  import { useState } from "react" // 👀
  ```

- We use `useState` to store what records have been selected.

  ```tsx
  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    // 👀
    all: false,
    ids: [],
  })
  ```

  Note, that `selected.all` will indicate if the header is checked and `selected.ids` will indicate which
  records are selected.

- We create a button to tell the user what records have been selected and if the header has been checked.

  ```tsx
  <button onClick={() => alert(`all: ${selected.all}, ids: ${selected.ids}`)}>action</button>
  ```

- Finally, we specify what should be selected and listen to selected changes and update our `selected` state:

  ```tsx
  <TodoList defaultSelected={selected} onSelectedChange={(selected) => setSelected(selected)}></TodoList>
  ```

  Note, setting `onSelectedChange` is what tells `TodoList` to show the checkbox column.

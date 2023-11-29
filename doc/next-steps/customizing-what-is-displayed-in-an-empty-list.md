# Customizing what is displayed in an empty list

The following guide shows how to customize what is displayed if there are no items in a list. We will extend the
getting started guide to show a nice empty list message as shown below:

![image](https://github.com/bitovi/hatchify/assets/2623867/f4444c37-e77d-44f8-bda0-0356efe6600d)

## Code

Update `/src/App.tsx` to the following:

```tsx
// hatchify-app/frontend/App.tsx
import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as schemas from "../schemas"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", schemas),
)

const TodoList = hatchedReact.components.Todo.Collection
const TodoEmpty = hatchedReact.components.Todo.Empty // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList>
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

## How it works

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

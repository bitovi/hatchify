import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", Schemas),
)

const TodoList = hatchedReact.components.Todo.Collection

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoList />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

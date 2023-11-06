import {
  hatchifyReact,
  MuiProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import * as Schemas from "../schemas"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", Schemas),
)

const TodoList = hatchedReact.components.Todo.Collection

const App: React.FC = () => {
  return (
    <MuiProvider>
      <TodoList />
    </MuiProvider>
  )
}

export default App

// hatchify-app/src/App.tsx
import {
  hatchifyReact,
  MuiProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { Todo } from "../schemas/todo"
import { User } from "../schemas/user"

export const hatchedReact = hatchifyReact(
  { Todo, User },
  createJsonapiClient("http://localhost:3000/api", {
    Todo: { endpoint: "todos" },
    User: { endpoint: "users" },
  }),
)

const TodoList = hatchedReact.components.Todo.List
const TodoEmptyList = hatchedReact.components.Todo.EmptyList

const App: React.FC = () => {
  return (
    <MuiProvider>
      <TodoList>
        <TodoEmptyList
          label="Empty List"
          render={() => {
            return <div>No records to display</div>
          }}
        />
      </TodoList>
    </MuiProvider>
  )
}

export default App

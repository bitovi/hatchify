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
const TodoExtraDisplay = hatchedReact.components.Todo.ExtraDisplay
const TodoEmptyList = hatchedReact.components.Todo.EmptyList

const App: React.FC = () => {
  return (
    <MuiProvider>
      <TodoList>
        <TodoEmptyList>
          <div>
            {"No records to display"}
            <button>click here</button>
          </div>
        </TodoEmptyList>
        <TodoExtraDisplay
          label="Action"
          render={({ record }) => {
            return (
              <>
                <button onClick={() => console.log(record)}>Download</button>
                <button onClick={() => console.log(record)}>Open</button>
                <button onClick={() => console.log(record)}>
                  More Actions
                </button>
              </>
            )
          }}
        />
      </TodoList>
    </MuiProvider>
  )
}

export default App

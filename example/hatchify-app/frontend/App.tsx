// hatchify-app/src/App.tsx
import { useState } from "react"
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
const TodoExtraColumn = hatchedReact.components.Todo.ExtraColumn
const TodoEmptyList = hatchedReact.components.Todo.EmptyList

const App: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <MuiProvider>
      <button onClick={() => alert(`action on [${selected.join(",")}]`)}>
        action
      </button>
      <TodoList selectable onSelectionChange={(ids) => setSelected(ids)}>
        <TodoEmptyList>
          <div>No records to display</div>
        </TodoEmptyList>
        <TodoExtraColumn
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

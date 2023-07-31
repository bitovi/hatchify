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

const TodoList = hatchedReact.components.Todo.Collection
const TodoColumn = hatchedReact.components.Todo.Column
const TodoEmptyList = hatchedReact.components.Todo.Empty

const App: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])

  return (
    <MuiProvider>
      <button
        onClick={() => alert(`action on [${selected.join(",")}]`)}
        style={{ margin: 10 }}
      >
        action
      </button>
      <TodoList onSelectedChange={(ids: string[]) => setSelected(ids)}>
        <TodoEmptyList>No records to display</TodoEmptyList>
        <TodoColumn
          type="append"
          label="Action"
          renderValue={({ record }) => {
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

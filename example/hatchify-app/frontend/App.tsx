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
const TodoFilter = hatchedReact.components.Todo.Filter
console.log("COMPONWNNETS", hatchedReact.components.Todo)

const App: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])
  console.log(selected)
  return (
    <MuiProvider>
      <TodoList selectable onSelectionChange={(ids) => setSelected(ids)}>
        <TodoEmptyList>
          <div>No records to display</div>
        </TodoEmptyList>
        <TodoExtraColumn
          label="Action"
          render={({ record }) => {
            return (
              <button onClick={() => alert(`action on record ${record.id}`)}>
                Download
              </button>
            )
          }}
        />
      </TodoList>
    </MuiProvider>
  )
}

export default App

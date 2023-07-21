// hatchify-app/src/App.tsx
import { useState } from "react"
import {
  hatchifyReact,
  MuiProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { Todo } from "../schemas/todo"
import { User } from "../schemas/user"
import type { Filter } from "@hatchifyjs/rest-client"

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

const App: React.FC = () => {
  const [selected, setSelected] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>(undefined)

  return (
    <MuiProvider>
      <button onClick={() => alert(`action on [${selected.join(",")}]`)}>
        action
      </button>
      <TodoFilter filters={filter} setFilters={setFilter}>
        <div style={{ cursor: "pointer" }}>Filter</div>
      </TodoFilter>
      <TodoList
        selectable
        onSelectionChange={(ids) => setSelected(ids)}
        filter={filter}
      >
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

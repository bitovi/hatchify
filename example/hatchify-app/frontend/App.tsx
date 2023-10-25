// hatchify-app/src/App.tsx
import { useState } from "react"
import {
  hatchifyReact,
  MuiProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import schemas from "../schemas/schemas"

export const hatchedReact = hatchifyReact(
  createJsonapiClient("http://localhost:3000/api", schemas),
)

const TodoList = hatchedReact.components.Todo.Collection
const TodoColumn = hatchedReact.components.Todo.Column
const TodoEmptyList = hatchedReact.components.Todo.Empty
// hatchedReact.model.Todo.findAll({}).then(([todos]) => {
//   console.log(todos)
//   todos[0].user.
// })
// hatchedReact.model.User.findAll({}).then(([users]) => {
//   console.log(users)
//   users[0].todos[0].
// })

const App: React.FC = () => {
  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    all: false,
    ids: [],
  })

  function onActionClick() {
    if (!selected.all && !selected.ids.length) alert("action on no items")
    else if (selected.all)
      alert(`action on ALL ITEMS or items ${selected.ids.join(",")}`)
    else alert(`action on items ${selected.ids.join(",")}`)
  }

  return (
    <MuiProvider>
      <button onClick={onActionClick} style={{ margin: 10 }}>
        action
      </button>
      <TodoList
        defaultSelected={selected}
        onSelectedChange={(selected) => setSelected(selected)}
      >
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

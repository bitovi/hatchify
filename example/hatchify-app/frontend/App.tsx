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

hatchedReact.model.Todo.createOne({
  attributes: { fake: "fake" },
}).catch((e: any) => {
  console.log("eeeeeeeeee", e)
})

const App: React.FC = () => {
  const [create, meta, created] = hatchedReact.model.Todo.useCreateOne()
  console.log("meta", meta)

  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    all: false,
    ids: [],
  })

  function onActionClick() {
    create({ attributes: { fake: "fake" } })
    // if (!selected.all && !selected.ids.length) alert("action on no items")
    // else if (selected.all)
    // alert(`action on ALL ITEMS or items ${selected.ids.join(",")}`)
    // else alert(`action on items ${selected.ids.join(",")}`)
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

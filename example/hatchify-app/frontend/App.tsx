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
// hatchedReact.model.Todo.createOne({
//   attributes: {
//     uuid: "1",
//   }
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

  function ValCom({ record }: { record: any }) {
    return <strong>{record.id}</strong>
  }

  function HeadCom({ record }: { record: any }) {
    return <strong>Header</strong>
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
          field="dueDate"
          label="Cool"
          dataCellRenderValue={({ record }) => <>{record.importance}</>}
          headerCellRenderValue={({ record }) => <>{record.foo}</>}
        />
        <TodoColumn
          label="Beans,"
          headerCellRenderValue={() => (
            <div
              style={{
                backgroundColor: "forestGreen",
                color: "white",
                borderRadius: "5px",
                padding: "5px",
                textAlign: "center",
              }}
            >
              <strong>Tada!</strong>
            </div>
          )}
        />
        <TodoColumn
          type="append"
          label="My Dude"
          HeaderCellValueComponent={HeadCom}
          DataCellValueComponent={ValCom}
        />
        <TodoColumn type="prepend" label="Very" />
      </TodoList>
    </MuiProvider>
  )
}

export default App

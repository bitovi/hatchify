import { useState } from "react"
import { hatchifyReactRest } from "@hatchifyjs/react-rest"
import { jsonapi as createClient } from "@hatchifyjs/rest-client-jsonapi"

const Todo = {
  name: "Todo",
  displayAttribute: "name",
  attributes: {
    name: "string",
  },
}

const jsonapi = createClient("/api", {
  Todo: { endpoint: "todos" },
})

const hatchedReactRest = hatchifyReactRest({ Todo }, jsonapi)

function App() {
  const [todos, listState] = hatchedReactRest.Todo.useAll({})
  const [createTodo, createState] = hatchedReactRest.Todo.useCreateOne()
  const [deleteTodo, deleteState] = hatchedReactRest.Todo.useDeleteOne()
  const [todoName, setTodoName] = useState("")

  if (listState.isLoading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={todoName}
          onChange={(e) => setTodoName(e.target.value)}
        />
        <button
          disabled={createState.isLoading}
          type="button"
          onClick={() => createTodo({ attributes: { name: todoName } })}
        >
          {createState.isLoading ? "submitting..." : "submit"}
        </button>
      </div>
      <table>
        <thead>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>
                <button
                  disabled={deleteState.isLoading}
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  )
}

export default App

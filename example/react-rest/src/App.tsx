import { useState } from "react"
import type { Schema } from "@hatchifyjs/react-rest"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import createClient from "@hatchifyjs/rest-client-jsonapi"

const Todo: Schema = {
  name: "Todo",
  displayAttribute: "name",
  attributes: {
    name: "string",
  },
  relationships: {
    user: {
      type: "one",
      schema: "User",
    },
  },
}

const User: Schema = {
  name: "User",
  displayAttribute: "name",
  attributes: {
    name: "string",
  },
  relationships: {
    todos: {
      type: "many",
      schema: "Todo",
    },
  },
}

const jsonapi = createClient("/api", {
  Todo: { endpoint: "todos" },
  User: { endpoint: "users" },
})

const hatchedReactRest = hatchifyReactRest({ Todo, User }, jsonapi)

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
          onClick={() => {
            createTodo({ attributes: { name: todoName } })
            setTodoName("")
          }}
        >
          {createState.isLoading ? "submitting..." : "submit"}
        </button>
      </div>
      <table>
        <thead>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>{todo.user.name}</td>
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

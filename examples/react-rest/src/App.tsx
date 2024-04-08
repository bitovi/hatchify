import { PartialSchema, belongsTo, hasMany, string } from "@hatchifyjs/core"
import createClient from "@hatchifyjs/rest-client-jsonapi"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import { useState } from "react"

const Todo = {
  name: "Todo",
  displayAttribute: "name",
  attributes: {
    name: string(),
  },
  relationships: {
    user: belongsTo("User"),
  },
} satisfies PartialSchema

const User = {
  name: "User",
  displayAttribute: "name",
  attributes: {
    name: string(),
  },
  relationships: {
    todos: hasMany("Todo"),
  },
} satisfies PartialSchema

const jsonapi = createClient("/api", { Todo, User })

const hatchedReactRest = hatchifyReactRest(jsonapi)

function App() {
  const [todos, listState] = hatchedReactRest.Todo.useAll({ include: ["user"] })
  const [createTodo, createState] = hatchedReactRest.Todo.useCreateOne()
  const [deleteTodo, deleteState] = hatchedReactRest.Todo.useDeleteOne()
  const [todoName, setTodoName] = useState("")

  const [users, usersState] = hatchedReactRest.User.useAll()
  const [selectedUser, setSelectedUser] = useState("")

  if (listState.isPending) {
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
        <select
          disabled={usersState.isPending}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">select user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        <button
          disabled={createState.isPending}
          type="button"
          onClick={() => {
            createTodo({
              name: todoName,
              user: { id: selectedUser },
            })
            setTodoName("")
            setSelectedUser("")
          }}
        >
          {createState.isPending ? "submitting..." : "submit"}
        </button>
      </div>
      <table>
        <thead>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>{todo.user?.name}</td>
              <td>
                <button
                  disabled={deleteState[todo.id]?.isPending}
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

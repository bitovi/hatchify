import { useEffect, useState } from "react"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import createJsonapiClient from "@hatchifyjs/rest-client-jsonapi"
import * as schemas from "../schemas.js"
// import WithoutHooks from "./WithoutHooks"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Todo = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = any

const hatchedReactRest = hatchifyReactRest(
  createJsonapiClient("http://localhost:3000/api", schemas),
)

const App: React.FC = () => {
  return (
    <div>
      <h1>With Hooks</h1>
      <Todos />
      <Users />
      <hr />
      <hr />
      {/* <h1>Without Hooks</h1>
      <WithoutHooks /> */}
    </div>
  )
}

export default App

function Todos() {
  const [enableFilter, setEnableFilter] = useState(false)
  const [todos, todosState] = hatchedReactRest.Todo.useAll({
    include: ["user"],
    fields: { Todo: ["name"] },
  })
  const [users, usersState] = hatchedReactRest.User.useAll()
  const [createTodo, createState] = hatchedReactRest.Todo.useCreateOne()
  const [deleteTodo, deleteState] = hatchedReactRest.Todo.useDeleteOne()
  const [todoName, setTodoName] = useState("")
  const [selectedUser, setSelectedUser] = useState("")

  useEffect(() => {
    // console.log("todosState has changed", todosState)
  }, [todosState])

  if (todosState.isPending) return <div>fetching todos...</div>
  if (todosState.isRejected) return <div>failed to fetch todos</div>

  return (
    <div>
      <h2>Todos</h2>
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
        {users.map((user: User) => (
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
            ...(selectedUser && { user: { id: selectedUser } }),
          })
          setTodoName("")
          setSelectedUser("")
        }}
      >
        {createState.isPending ? "creating..." : "create todo"}
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>User</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo: Todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>{todo.user?.name}</td>
              <td>
                <button
                  disabled={deleteState.isPending}
                  type="button"
                  onClick={() => deleteTodo(todo.id)}
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="button" onClick={() => setEnableFilter(!enableFilter)}>
        {enableFilter ? "disable filter" : "filter [Workout, other]"}
      </button>
    </div>
  )
}

function Users() {
  const [users, usersState] = hatchedReactRest.User.useAll()
  const [createUser, createState] = hatchedReactRest.User.useCreateOne()
  const [deleteUser, deleteState] = hatchedReactRest.User.useDeleteOne()
  const [userName, setUserName] = useState("")
  const [userIdToEdit, setUserIdToEdit] = useState<string | null>(null)

  if (usersState.isPending) return <div>fetching users...</div>
  if (usersState.isRejected) return <div>failed to fetch users</div>

  return (
    <div>
      <h2>Users</h2>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        disabled={createState.isPending}
        type="button"
        onClick={() => {
          createUser({ name: userName })
          setUserName("")
        }}
      >
        create user
      </button>
      {createState.error && <div>{createState?.error[0]?.detail}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: User) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <button
                  disabled={deleteState.isPending}
                  type="button"
                  onClick={() => deleteUser(user.id)}
                >
                  delete
                </button>
              </td>
              <td>
                <button
                  disabled={deleteState.isPending}
                  type="button"
                  onClick={() => setUserIdToEdit(user.id)}
                >
                  edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {userIdToEdit && (
          <EditUser id={userIdToEdit} setUserIdToEdit={setUserIdToEdit} />
        )}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EditUser({ id, setUserIdToEdit }: any) {
  const [updateUser, updateState] = hatchedReactRest.User.useUpdateOne()
  const [user, userState] = hatchedReactRest.User.useOne(id)
  const [name, setName] = useState("")

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user?.name])

  if (userState.isPending) return <div>fetching user...</div>
  if (!user || userState.isRejected) return <div>failed to fetch user</div>

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        disabled={updateState.isPending}
        type="button"
        onClick={() => {
          updateUser({ id, name })
          setUserIdToEdit(null)
        }}
      >
        submit
      </button>
    </div>
  )
}

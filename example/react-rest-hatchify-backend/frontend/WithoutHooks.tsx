import { useEffect, useState } from "react"
import { hatchedReactRest } from "./App.jsx"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Todo = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type User = any

const WithoutHooks: React.FC = () => {
  return (
    <div>
      <Todos />
      <Users />
    </div>
  )
}

export default WithoutHooks

function Todos() {
  const [enableFilter, setEnableFilter] = useState(false)

  const [todos, setTodos] = useState<Todo[]>([])
  const [loadingTodos, setLoadingTodos] = useState(true)
  const [errorTodo, setErrorTodo] = useState<Error | undefined>(undefined)

  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [errorUser, setErrorUser] = useState<Error | undefined>(undefined)

  const fetchTodos = () => {
    setLoadingTodos(true)
    hatchedReactRest.Todo.findAll({
      include: ["user"],
      fields: { Todo: ["name"] },
      filter: enableFilter ? { name: ["Workout", "other"] } : undefined,
    })
      .then(([todos]: [Todo[]]) => {
        setTodos(todos)
        setErrorTodo(undefined)
      })
      .catch((error: Error) => {
        setErrorTodo(error)
      })
      .finally(() => {
        setLoadingTodos(false)
      })
  }

  const fetchUsers = () => {
    setLoadingUsers(true)
    hatchedReactRest.User.findAll({})
      .then(([users]: [User[]]) => {
        setUsers(users)
        setErrorUser(undefined)
      })
      .catch((error: Error) => {
        setErrorUser(error)
      })
      .finally(() => {
        setLoadingUsers(false)
      })
  }

  useEffect(() => {
    fetchTodos()
  }, [enableFilter])

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    return hatchedReactRest.Todo.subscribeToAll(undefined, () => {
      fetchTodos()
      fetchUsers()
    })
  }, [])

  const [todoName, setTodoName] = useState("")
  const [selectedUser, setSelectedUser] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  if (loadingTodos) return <div>fetching todos...</div>
  if (errorTodo) return <div>failed to fetch todos</div>
  if (errorUser) return <div>failed to fetch users</div>

  return (
    <div>
      <h2>Todos</h2>
      <input
        type="text"
        value={todoName}
        onChange={(e) => setTodoName(e.target.value)}
      />
      <select
        disabled={loadingUsers}
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
        type="button"
        disabled={submitting}
        onClick={() => {
          setSubmitting(true)
          hatchedReactRest.Todo.createOne({
            type: "Todo",
            attributes: { name: todoName },
            relationships: selectedUser
              ? {
                  user: { data: { type: "User", id: selectedUser } },
                }
              : undefined,
          }).finally(() => {
            setSubmitting(false)
            setTodoName("")
            setSelectedUser("")
          })
        }}
      >
        {submitting ? "creating..." : "create todo"}
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
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.name}</td>
              <td>{todo.user?.name}</td>
              <td>
                <button
                  disabled={deleting}
                  type="button"
                  onClick={() => {
                    setDeleting(true)
                    hatchedReactRest.Todo.deleteOne(todo.id).finally(() =>
                      setDeleting(false),
                    )
                  }}
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
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const fetchUsers = () => {
    setLoading(true)
    hatchedReactRest.User.findAll({})
      .then(([users]: [User[]]) => {
        setUsers(users)
        setError(undefined)
      })
      .catch((error: Error) => {
        setError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    return hatchedReactRest.User.subscribeToAll(undefined, () => {
      fetchUsers()
    })
  }, [])

  const [userName, setUserName] = useState("")
  const [userIdToEdit, setUserIdToEdit] = useState<string | null>(null)

  if (loading) return <div>fetching users...</div>
  if (error) return <div>failed to fetch users</div>

  return (
    <div>
      <h2>Users</h2>
      <input
        type="text"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />
      <button
        disabled={creating}
        type="button"
        onClick={() => {
          setCreating(true)
          hatchedReactRest.User.createOne({
            type: "User",
            attributes: { name: userName },
          }).finally(() => {
            setCreating(false)
            setUserName("")
          })
        }}
      >
        create user
      </button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>
                <button
                  disabled={deleting}
                  type="button"
                  onClick={() => {
                    setDeleting(true)
                    hatchedReactRest.User.deleteOne(user.id).finally(() =>
                      setDeleting(false),
                    )
                  }}
                >
                  delete
                </button>
              </td>
              <td>
                <button
                  disabled={deleting}
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
  const [updating, setUpdating] = useState(false)
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
        disabled={updating}
        type="button"
        onClick={() => {
          setUpdating(true)
          hatchedReactRest.User.updateOne({
            id,
            type: "User",
            attributes: { name },
          }).finally(() => {
            setUpdating(false)
            setUserIdToEdit(null)
          })
        }}
      >
        submit
      </button>
    </div>
  )
}

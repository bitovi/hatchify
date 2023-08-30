import { integer } from "@hatchifyjs/hatchify-core"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import createClient from "@hatchifyjs/rest-client-jsonapi"

const Todo = {
  name: "Todo",
  attributes: {
    firstAttribute: integer(),
    secondAttribute: integer(),
    thirdAttribute: integer(),
  },
}

const jsonapi = createClient("/api", {
  Todo: { endpoint: "todos" },
})

const hatchedReactRest = hatchifyReactRest({ Todo }, jsonapi)

function App() {
  const [todos, listState] = hatchedReactRest.Todo.useAll()

  if (listState.isLoading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <table>
        <thead>
          {todos.map((todo) => (
            <tr key={todo.id}>
              <td>{todo.firstAttribute}</td>
              <td>{todo.secondAttribute}</td>
              <td>{todo.thirdAttribute}</td>
            </tr>
          ))}
        </thead>
      </table>
    </div>
  )
}

export default App

// import { useState } from "react"
// import type { Schema } from "@hatchifyjs/react-rest"
// import hatchifyReactRest from "@hatchifyjs/react-rest"
// import createClient from "@hatchifyjs/rest-client-jsonapi"

// const Todo: Schema = {
//   name: "Todo",
//   displayAttribute: "name",
//   attributes: {
//     name: "string",
//   },
//   relationships: {
//     user: {
//       type: "one",
//       schema: "User",
//     },
//   },
// }

// const User: Schema = {
//   name: "User",
//   displayAttribute: "name",
//   attributes: {
//     name: "string",
//   },
//   relationships: {
//     todos: {
//       type: "many",
//       schema: "Todo",
//     },
//   },
// }

// const jsonapi = createClient("/api", {
//   Todo: { endpoint: "todos" },
//   User: { endpoint: "users" },
// })

// const hatchedReactRest = hatchifyReactRest({ Todo, User }, jsonapi)

// function App() {
//   const [todos, listState] = hatchedReactRest.Todo.useAll({ include: ["user"] })
//   const [createTodo, createState] = hatchedReactRest.Todo.useCreateOne()
//   const [deleteTodo, deleteState] = hatchedReactRest.Todo.useDeleteOne()
//   const [todoName, setTodoName] = useState("")

//   const [users, usersState] = hatchedReactRest.User.useAll()
//   const [selectedUser, setSelectedUser] = useState("")

//   if (listState.isLoading) {
//     return <div>loading...</div>
//   }

//   return (
//     <div>
//       <div>
//         <input
//           type="text"
//           value={todoName}
//           onChange={(e) => setTodoName(e.target.value)}
//         />
//         <select
//           disabled={usersState.isLoading}
//           value={selectedUser}
//           onChange={(e) => setSelectedUser(e.target.value)}
//         >
//           <option value="">select user</option>
//           {users.map((user) => (
//             <option key={user.id} value={user.id}>
//               {user.name}
//             </option>
//           ))}
//         </select>
//         <button
//           disabled={createState.isLoading}
//           type="button"
//           onClick={() => {
//             createTodo({
//               attributes: { name: todoName },
//               relationships: { user: { id: selectedUser } },
//             })
//             setTodoName("")
//             setSelectedUser("")
//           }}
//         >
//           {createState.isLoading ? "submitting..." : "submit"}
//         </button>
//       </div>
//       <table>
//         <thead>
//           {todos.map((todo) => (
//             <tr key={todo.id}>
//               <td>{todo.name}</td>
//               <td>{todo.user?.name}</td>
//               <td>
//                 <button
//                   disabled={deleteState.isLoading}
//                   type="button"
//                   onClick={() => deleteTodo(todo.id)}
//                 >
//                   delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </thead>
//       </table>
//     </div>
//   )
// }

// export default App

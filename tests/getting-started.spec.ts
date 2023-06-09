import { test, expect } from "@playwright/test"

test.beforeEach(async ({ request }) => {
  console.log("deleting db 🔥🔥🔥🔥")
  const backend = "http://localhost:3000"
  //delete all db entries before testing
  const users = await request.get(`${backend}/api/users`)
  const usersData = await users.json()
  const todos = await request.get(`${backend}/api/todos`)
  const todosData = await todos.json()

  if (usersData.data.length > 0) {
    for (let i = 0; i < usersData.data.length; i++) {
      await request.delete(`${backend}/api/users/${usersData.data.id}`)
    }
  }

  if (todosData.data.length > 0) {
    for (let i = 0; i < todosData.data.length; i++) {
      await request.delete(`${backend}/api/todos/${todosData.data.id}`)
    }
  }
  const todos1 = await request.get(`${backend}/api/todos`)
  const todosData1 = await todos1.json()
  console.log("deleting db 🔥🔥🔥🔥", todosData1)
})

test("works", async ({ page, request }) => {
  const backend = "http://localhost:3000"
  const frontend = "http://localhost:5173"
  let response
  let json

  // validate backend is running
  await page.goto(backend)
  await expect(page.getByText("Not found")).toBeVisible()

  // validate todos endpoint exists
  response = await page.goto(`${backend}/api/todos`)
  if (!response) throw new Error("No response")
  json = await response.json()
  expect(json.data).toEqual([])

  // validate users endpoint exists
  response = await page.goto(`${backend}/api/users`)
  if (!response) throw new Error("No response")
  json = await response.json()
  expect(json.data).toEqual([])

  // validate frontend is running
  await page.goto(frontend)
  await expect(page.getByText("Name")).toBeVisible()
  await expect(page.getByText("Due Date")).toBeVisible()
  await expect(page.getByText("Importance")).toBeVisible()
  await expect(page.getByText("user")).toBeVisible()

  // * post user
  const newUser = await request.post(`${backend}/api/users`, {
    data: {
      type: "User",
      attributes: {
        name: "John Doe",
      },
    },
  })
  expect(newUser.ok()).toBeTruthy()
  const newUserData = await newUser.json()

  // * post todos with relationship to user
  const newTodo = await request.post(`${backend}/api/todos`, {
    data: {
      type: "Todo",
      attributes: {
        name: "Walk the dog",
        due_date: "12-12-2024",
        importance: 0.6,
      },
      relationships: {
        user: {
          data: { type: "User", id: newUserData.data.id },
        },
      },
    },
  })
  expect(newTodo.ok()).toBeTruthy()

  // * validate todos endpoint returns todos
  const allTodos = await request.get(`${backend}/api/todos`)
  const allTodoData = await allTodos.json()

  expect(allTodos.ok()).toBeTruthy()
  expect(allTodoData.data.length).toEqual(1)

  // * validate users endpoint returns users
  const allUsers = await request.get(`${backend}/api/users`)
  const allUserData = await allUsers.json()
  expect(allUserData.data.length).toEqual(1)

  // * validate included array gets returned
  const todosWithUser = await request.get(`${backend}/api/todos?include=user`)
  const todosWithUserData = await todosWithUser.json()
  console.log("🟢🟢🟢🟢🟢", todosWithUserData)

  // * validate frontend shows todos with user
  await expect(page.getByText("Walk the dog")).toBeVisible()
  await expect(page.getByText("12-12-2024")).toBeVisible()
  await expect(page.getByText("0.6")).toBeVisible()
  await expect(page.getByText("John Doe")).toBeVisible()
})

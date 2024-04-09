/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test"

test("works", async ({ page, request }) => {
  const backend = "http://localhost:3001"
  const frontend = "http://localhost:3001"
  let response
  let json

  // validate documents endpoint exists
  response = await page.goto(`${backend}/api/documents`)
  if (!response) {
    throw [new Error("No response")]
  }
  json = await response.json()
  expect(json.data).toEqual([])

  // validate users endpoint exists
  response = await page.goto(`${backend}/api/users`)
  if (!response) {
    throw [new Error("No response")]
  }
  json = await response.json()
  expect(json.data).toEqual([])

  // validate frontend is running
  await page.goto(frontend)
  await expect(page.getByText("Name")).toBeVisible()
  await expect(page.getByText("Due Date")).toBeVisible()
  await expect(page.getByText("Importance")).toBeVisible()
  await expect(page.getByText("Last Updated")).toBeVisible()
  await expect(page.getByText("Notes")).toBeVisible()
  await expect(page.getByText("Complete")).toBeVisible()
  await expect(page.getByText("Uuid")).toBeVisible()
  await expect(page.getByText("Uploaded By")).toBeVisible()
  await expect(page.getByText("Action")).toBeVisible()

  // * post a document
  const newDocument = await request.post(`${backend}/api/documents`, {
    data: {
      data: {
        type: "Document",
        attributes: {
          name: "Test",
          dueDate: "2023-07-05",
          importance: 6,
          lastUpdated: "2023-07-05T20:30:52.767Z",
          notes: "Bla bla",
          complete: true,
          uuid: "0d0c276f-4908-45c4-adc6-242e35d33eb7",
          status: "Pending",
        },
      },
    },
  })
  expect(newDocument.ok()).toBeTruthy()
  const newDocumentData = await newDocument?.json()

  // * post user with a document relationship
  const newUser = await request.post(`${backend}/api/users`, {
    data: {
      data: {
        type: "User",
        attributes: {
          name: "John Doe",
        },
        relationships: {
          documents: {
            data: [{ type: "Document", id: newDocumentData.data.id }],
          },
        },
      },
    },
  })

  expect(newUser.ok()).toBeTruthy()
  const newUserData = await newUser.json()

  // * validate documents endpoint returns documents
  const allDocuments = await request.get(`${backend}/api/documents`)
  const allDocumentData = await allDocuments.json()

  expect(allDocuments.ok()).toBeTruthy()
  expect(allDocumentData.data.length).toEqual(1)

  // * validate users endpoint returns users
  const allUsers = await request.get(`${backend}/api/users`)
  const allUserData = await allUsers.json()
  expect(allUserData.data.length).toEqual(1)

  // * validate included array gets returned
  const documentsWithUser = await request.get(
    `${backend}/api/documents?include=uploadedBy`,
  )
  const documentsWithUserData = await documentsWithUser.json()
  expect(documentsWithUserData.data.length).toEqual(1)
  expect(documentsWithUserData.included.length).toEqual(1)

  // * validate frontend shows documents with user
  await page.goto(frontend)
  await page.reload()

  await expect(page.getByText("Test")).toBeVisible()
  await expect(page.getByText("7/5/2023")).toBeVisible()
  await expect(page.getByText("6", { exact: true })).toBeVisible()
  await expect(page.getByText("2023-07-05 1:30 pm")).toBeVisible()
  await expect(page.getByText("Bla bla")).toBeVisible()
  await expect(page.getByText("true")).toBeVisible()
  await expect(
    page.getByText("0d0c276f-4908-45c4-adc6-242e35d33eb7"),
  ).toBeVisible()
  await expect(page.getByText("Pending")).toBeVisible()
  await expect(page.getByText("John Doe")).toBeVisible()

  // * validate delete documents endpoint works
  const deleteDocument = await request.delete(
    `${backend}/api/documents/${newDocumentData.data.id}`,
  )
  expect(deleteDocument.ok()).toBeTruthy()
  const noDocuments = await request.get(`${backend}/api/documents`)
  const noDocumentData = await noDocuments.json()
  expect(noDocumentData.data.length).toEqual(0)

  // * validate delete users endpoint works
  const deleteUser = await request.delete(
    `${backend}/api/users/${newUserData.data.id}`,
  )
  expect(deleteUser.ok()).toBeTruthy()
  const noUsers = await request.get(`${backend}/api/users`)
  const noUserData = await noUsers.json()
  expect(noUserData.data.length).toEqual(0)
})

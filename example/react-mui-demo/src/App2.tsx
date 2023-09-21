import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  hatchifyReact,
  createJsonapiClient,
  MuiProvider,
} from "@hatchifyjs/react"
import Layout from "./components"
import { Category, Document } from "./schemas"

const hatchedReact = hatchifyReact(
  { Category, Document },
  createJsonapiClient("https://dummy.data/api", {
    Document: { ...Document, type: "document", endpoint: "documents" },
    Category: { ...Category, type: "category", endpoint: "categories" },
  }),
)

const DocumentList = hatchedReact.components.Document.Collection

// @ts-expect-error
const baseUrl = import.meta.env.BASE_URL

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [{ path: "/", element: <DocumentList /> }],
    },
  ],
  { basename: baseUrl },
)

const App: React.FC = () => {
  return (
    <MuiProvider>
      <RouterProvider router={router} />
    </MuiProvider>
  )
}

export default App

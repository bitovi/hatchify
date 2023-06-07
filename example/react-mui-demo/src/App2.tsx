import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {
  hatchifyReact,
  createJsonapiClient,
  MuiProvider,
} from "@hatchifyjs/react"
import Layout from "./components"

const schemas = {
  Document: {
    name: "Document",
    attributes: {
      title: "string",
      date: "date",
      url: "string",
    },
    hasOne: [
      {
        target: "Category",
        options: { as: "category" },
      },
    ],
  },
  Category: {
    name: "Category",
    attributes: {
      name: "string",
    },
  },
}

const hatchedReact = hatchifyReact(
  schemas,
  createJsonapiClient("https://dummy.data/api", {
    Document: { type: "document", endpoint: "documents" },
    Category: { type: "category", endpoint: "categories" },
  }),
)

const DocumentList = hatchedReact.components.Document.List

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

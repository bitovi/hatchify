import { createBrowserRouter, RouterProvider } from "react-router-dom"
import {MuiProvider} from "@hatchifyjs/design-mui"

import Layout from "./components"
import {
  Documents,
  ViewDocument,
  CreateDocument,
  Categories,
  ViewCategory,
  CreateCategory,
  Users,
  ViewUser,
  CreateUser,
  FileTypes,
  ViewFileType,
  CreateFileType
} from "./pages"

// @ts-expect-error
const baseUrl = import.meta.env.BASE_URL

const router = createBrowserRouter(
  [
    {
      element: <Layout />,
      children: [
        { path: "/", element: <Documents /> },
        { path: "/documents", element: <Documents /> },
        { path: "/documents/add", element: <CreateDocument /> },
        { path: "/documents/:id", element: <ViewDocument /> },
        { path: "/categories", element: <Categories /> },
        { path: "/categories/add", element: <CreateCategory /> },
        { path: "/categories/:id", element: <ViewCategory /> },
        { path: "/users", element: <Users /> },
        { path: "/users/add", element: <CreateUser /> },
        { path: "/users/:id", element: <ViewUser /> },
        { path: "/fileTypes", element: <FileTypes /> },
        { path: "/fileTypes/add", element: <CreateFileType /> },
        { path: "/fileTypes/:id", element: <ViewFileType /> },
      ],
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

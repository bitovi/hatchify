import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MuiProvider from "@hatchifyjs/design-mui"

// import Layout from "@components/Layout"
// import {
//   List as Documents,
//   View as ViewDocument,
//   Create as CreateDocument,
// } from "@pages/Documents"
// import {
//   List as Categories,
//   View as ViewCategory,
//   Create as CreateCategory,
// } from "@pages/Categories"
// import {
//   List as FileTypes,
//   View as ViewFileType,
//   Create as CreateFileType,
// } from "@pages/FileTypes"
// import {
//   List as Users,
//   View as ViewUser,
//   Create as CreateUser,
// } from "@pages/Users"

// @<CLEARTHIS>ts-expect-error
// const baseUrl = import.meta.env.BASE_URL

// const router = createBrowserRouter(
//   [
//     {
//       element: <Layout />,
//       children: [
//         { path: "/", element: <Documents /> },
//         { path: "/documents", element: <Documents /> },
//         { path: "/documents/add", element: <CreateDocument /> },
//         { path: "/documents/:id", element: <ViewDocument /> },
//         { path: "/categories", element: <Categories /> },
//         { path: "/categories/add", element: <CreateCategory /> },
//         { path: "/categories/:id", element: <ViewCategory /> },
//         { path: "/users", element: <Users /> },
//         { path: "/users/add", element: <CreateUser /> },
//         { path: "/users/:id", element: <ViewUser /> },
//         { path: "/fileTypes", element: <FileTypes /> },
//         { path: "/fileTypes/add", element: <CreateFileType /> },
//         { path: "/fileTypes/:id", element: <ViewFileType /> },
//       ],
//     },
//   ],
//   { basename: baseUrl },
// )

const App: React.FC = () => {
  return (
    <MuiProvider>
      <div>Hello world</div>
    </MuiProvider>
    // <MuiProvider>
    //   <RouterProvider router={router} />
    // </MuiProvider>
  )
}

export default App

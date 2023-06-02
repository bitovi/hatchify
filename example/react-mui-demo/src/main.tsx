import React from "react"
import ReactDOM from "react-dom/client"
import { setupWorker } from "msw"
import mswHandlers from "./mocks/handlers"
import App from "./App"
import "./index.css"

// @ts-expect-error
const baseUrl = import.meta.env.BASE_URL
const worker = setupWorker(...mswHandlers)
worker.start({
  serviceWorker: {
    url: `${baseUrl === "/" ? baseUrl : `${baseUrl}/`}mockServiceWorker.js`,
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

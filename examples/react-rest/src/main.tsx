import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.js"

if (process.env.NODE_ENV === "development") {
  await import("./mocks/browser").then(({ worker }) => {
    worker.start()
  })
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

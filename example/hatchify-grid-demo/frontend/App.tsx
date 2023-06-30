// hatchify-app/src/App.tsx
import {
  hatchifyReact,
  MuiProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { Document } from "../schemas/Document"

export const hatchedReact = hatchifyReact(
  { Document },
  createJsonapiClient("http://localhost:3000/api", {
    Document: { endpoint: "documents" },
  }),
)

const DocumentList = hatchedReact.components.Document.List
const DocumentDisplay = hatchedReact.components.Document.AttributeDisplay
const DocumentExtraDisplay = hatchedReact.components.Document.ExtraDisplay

const App: React.FC = () => {
  return (
    <MuiProvider>
      <DocumentList>
        <DocumentDisplay attribute="name" />
        <DocumentDisplay
          attribute="date"
          renderValue={({ value }) => (
            <div style={{ color: "red" }}>{value}</div>
          )}
        />
        <DocumentExtraDisplay
          attribute="action"
          label="Action"
          render={({ record }) => {
            return <button onClick={() => console.log(record)}>Action</button>
          }}
        />
      </DocumentList>
    </MuiProvider>
  )
}

export default App

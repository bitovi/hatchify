import { useState } from "react"
import { getSchemaKey } from "@hatchifyjs/core"
import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"
import {
  DocumentActionsData,
  DocumentActionsHeader,
  DocumentDate,
  DocumentStatus,
} from "./components/DocumentTable.js"

type ActiveSchema = keyof typeof Schemas | undefined

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const Navigation = hatchedReact.Navigation
const defaultSchema = getSchemaKey(Object.values(Schemas)[0]) as ActiveSchema

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<ActiveSchema>(defaultSchema)

  const DataGrid = activeSchema
    ? hatchedReact.components[activeSchema].DataGrid
    : hatchedReact.NoSchemas

  const DocumentList = hatchedReact.components.Document.DataGrid
  const DocumentColumn = hatchedReact.components.Document.DataGrid.Column
  const DocumentEmptyList = hatchedReact.components.Document.DataGrid.Empty

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Navigation
          activeTab={activeSchema}
          onTabChange={(tab) => setActiveSchema(tab as ActiveSchema)}
        />
        {activeSchema === "Document" ? (
          <DocumentList>
            <DocumentColumn
              field="lastUpdated"
              renderDataValue={({ value }) => (
                <DocumentDate value={value as string} />
              )}
            />
            <DocumentColumn
              field="status"
              renderDataValue={({ value }) => (
                <DocumentStatus value={value as string} />
              )}
            />
            <DocumentColumn
              label="Action"
              renderDataValue={({ record }) => (
                <DocumentActionsData record={record} />
              )}
              HeaderValueComponent={DocumentActionsHeader}
            />
            <DocumentEmptyList>No records to display</DocumentEmptyList>
          </DocumentList>
        ) : (
          <DataGrid />
        )}
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

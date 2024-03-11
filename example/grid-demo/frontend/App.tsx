import { useState } from "react"
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
const defaultSchema = Object.values(Schemas)[0]?.name as ActiveSchema

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<ActiveSchema>(defaultSchema)

  const DataGrid = activeSchema
    ? hatchedReact.components[activeSchema].DataGrid
    : hatchedReact.NoSchemas
  const DocumentDataGrid = hatchedReact.components.Document.DataGrid

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Navigation
          activeTab={activeSchema}
          onTabChange={(tab) => setActiveSchema(tab as ActiveSchema)}
        />
        {activeSchema === "Document" ? (
          <DocumentDataGrid>
            <DocumentDataGrid.Column
              field="lastUpdated"
              renderDataValue={({ value }) => (
                <DocumentDate value={value as string} />
              )}
            />
            <DocumentDataGrid.Column
              field="status"
              renderDataValue={({ value }) => (
                <DocumentStatus value={value as string} />
              )}
            />
            <DocumentDataGrid.Column
              label="Action"
              renderDataValue={({ record }) => (
                <DocumentActionsData record={record} />
              )}
              HeaderValueComponent={DocumentActionsHeader}
            />
            <DocumentDataGrid.Empty>
              No records to display
            </DocumentDataGrid.Empty>
          </DocumentDataGrid>
        ) : (
          <DataGrid />
        )}
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

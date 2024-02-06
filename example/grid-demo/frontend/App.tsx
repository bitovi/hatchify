import { useState } from "react"
import { createTheme, ThemeProvider } from "@mui/material"
import {
  hatchifyReact,
  createJsonapiClient,
  HatchifyProvider,
} from "@hatchifyjs/react"
import * as schemas from "../schemas.js"
import {
  DocumentStatus,
  DocumentActionsData,
  DocumentActionsHeader,
  DocumentDate,
  ActionsRow,
} from "./components/DocumentTable.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))

const DocumentList = hatchedReact.components.Document.DataGrid
const DocumentColumn = hatchedReact.components.Document.Column
const DocumentEmptyList = hatchedReact.components.Document.Empty

const App: React.FC = () => {
  const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
    all: false,
    ids: [],
  })

  return (
    <ThemeProvider theme={theme}>
      <HatchifyProvider>
        <ActionsRow selected={selected} />
        <DocumentList
          defaultSelected={selected}
          onSelectedChange={(selected) => setSelected(selected)}
        >
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
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

const theme = createTheme({
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: "#F4F6F8",
          "& th": {
            color: "#818D96",
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "8px",
          "&:nth-of-type(1)": {
            width: 40,
          },
          "&:last-child": {
            textAlign: "right",
          },
        },
      },
    },
  },
})

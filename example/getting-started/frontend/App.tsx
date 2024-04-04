import { useState } from "react"
import { getSchemaKey } from "@hatchifyjs/core"
import {
  hatchifyReact,
  HatchifyProvider,
  createJsonapiClient,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"

type ActiveSchema = keyof typeof Schemas | undefined

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const Navigation = hatchedReact.Navigation
const defaultSchema = getSchemaKey(Object.values(Schemas)[0]) as ActiveSchema

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<ActiveSchema>(defaultSchema)

  const DataGrid = activeSchema
    ? hatchedReact.components[activeSchema].DataGrid
    : hatchedReact.NoSchemas

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Navigation
          activeTab={activeSchema}
          onTabChange={(tab) => setActiveSchema(tab as ActiveSchema)}
        />
        <DataGrid />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

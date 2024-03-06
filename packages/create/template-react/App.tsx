import { useState } from "react"
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
const defaultSchema = Object.values(Schemas)[0]?.name as ActiveSchema

const App: React.FC = () => {
  const [activeSchema, setActiveSchema] = useState<ActiveSchema>(defaultSchema)

  const DataGrid = activeSchema
    ? hatchedReact.components[activeSchema].DataGrid
    : hatchedReact.NoSchemas

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Navigation
          activeSchema={activeSchema}
          setActiveSchema={setActiveSchema}
        />
        <DataGrid />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App

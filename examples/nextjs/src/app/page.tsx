"use client"

import * as Schemas from "getting-started/schemas"
import {
  createJsonapiClient,
  HatchifyProvider,
  hatchifyReact,
} from "@hatchifyjs/react"
import { createTheme, ThemeProvider } from "@mui/material"
import { getSchemaKey } from "@hatchifyjs/core"
import { useState } from "react"

type ActiveSchema = keyof typeof Schemas | undefined

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
const Navigation = hatchedReact.Navigation
const defaultSchema = getSchemaKey(Object.values(Schemas)[0]) as ActiveSchema

export default function Home(): React.ReactElement {
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

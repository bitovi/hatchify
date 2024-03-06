import type { FinalSchemas } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import { Box, Tab, Tabs } from "@mui/material"

export interface MuiNavigationProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  activeSchema: keyof TSchemas | undefined
  setActiveSchema: (schema: keyof TSchemas) => void
  children?: React.ReactNode | null
}

function a11yProps(key: string) {
  return {
    id: `tab-${key}`,
    "aria-controls": `tabpanel-${key}`,
  }
}

function MuiNavigation<const TSchemas extends Record<string, PartialSchema>>({
  finalSchemas,
  partialSchemas,
  activeSchema,
  setActiveSchema,
}: MuiNavigationProps<TSchemas>): JSX.Element {
  if (!Object.values(partialSchemas).length) {
    return (
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          marginBottom: 2,
          padding: 1,
          textAlign: "center",
        }}
      >
        There are no schemas. Create some to get started!
      </Box>
    )
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
      <Tabs
        value={activeSchema}
        onChange={(_, newValue) => setActiveSchema(newValue)}
        aria-label="schema tabs navigation"
      >
        {Object.values(partialSchemas).map((schema) => {
          return (
            <Tab
              label={schema.name}
              key={schema.name}
              value={schema.name}
              {...a11yProps(schema.name)}
            />
          )
        })}
      </Tabs>
    </Box>
  )
}

MuiNavigation.displayName = "Navigation"

export default MuiNavigation

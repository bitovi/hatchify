import type { FinalSchemas } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import { Box, Tab, Tabs } from "@mui/material"

export interface MuiNavigationProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  activeTab: string | undefined
  onTabChange: (schema: string | undefined) => void
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
  activeTab,
  onTabChange,
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
        <span>
          There are no schemas.&#32;
          <a
            href="https://github.com/bitovi/hatchify?tab=readme-ov-file#schemas"
            target="_blank"
            rel="noreferrer"
          >
            Create some to get started!
          </a>
        </span>
      </Box>
    )
  }

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider", marginBottom: 2 }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => onTabChange(newValue)}
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

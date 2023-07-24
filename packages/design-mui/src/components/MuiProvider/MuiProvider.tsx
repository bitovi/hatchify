import type { Theme } from "@mui/material"
import type { XProviderProps } from "@hatchifyjs/react-ui"
import { createTheme, ThemeProvider } from "@mui/material"
import {
  HatchifyPresentationProvider,
  HatchifyPresentationDefaultValueComponents,
  HatchifyPresentationDefaultFieldComponents,
} from "@hatchifyjs/react-ui"
import { MuiLayout } from "../MuiLayout"
import { MuiForm } from "../MuiForm"
import { MuiDetails } from "../MuiDetails"
import MuiDataGrid from "../MuiDataGrid/MuiDataGrid"
import {
  String as StringInput,
  Number as NumberInput,
  Date as DateInput,
  Boolean as BooleanInput,
  Relationship as RelationshipInput,
} from "./DefaultFieldComponents"
import { Relationship, RelationshipList } from "./DefaultDisplayComponents"

const defaultTheme = createTheme()

export const MuiProvider: React.FC<XProviderProps<Theme>> = ({
  theme = defaultTheme,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <HatchifyPresentationProvider
        Collection={MuiDataGrid}
        Layout={MuiLayout}
        Details={MuiDetails}
        Form={MuiForm}
        defaultValueComponents={{
          ...HatchifyPresentationDefaultValueComponents,
          Relationship,
          RelationshipList,
        }}
        defaultFieldComponents={{
          ...HatchifyPresentationDefaultFieldComponents,
          String: StringInput,
          Date: DateInput,
          Number: NumberInput,
          Boolean: BooleanInput,
          Relationship: RelationshipInput,
        }}
      >
        {children}
      </HatchifyPresentationProvider>
    </ThemeProvider>
  )
}

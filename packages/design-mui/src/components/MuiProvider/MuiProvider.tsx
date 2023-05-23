import { createTheme, ThemeProvider } from "@mui/material"
import type { Theme } from "@mui/material"

import {
  HatchifyPresentationProvider,
  HatchifyPresentationDefaultValueComponents,
  HatchifyPresentationDefaultFieldComponents,
} from "@hatchifyjs/react-ui"
import { MuiLayout } from "../MuiLayout"
import { MuiList } from "../MuiList"
import { MuiForm } from "../MuiForm"
import { MuiDetails } from "../MuiDetails"
import {
  String as StringInput,
  Number as NumberInput,
  Date as DateInput,
  Boolean as BooleanInput,
  Relationship as RelationshipInput,
} from "./DefaultFieldComponents"
import { Relationship, RelationshipList } from "./DefaultDisplayComponents"
import type { XProviderProps } from "@hatchifyjs/react-ui"

const defaultTheme = createTheme()

export const MuiProvider: React.FC<XProviderProps<Theme>> = ({
  theme = defaultTheme,
  children,
}) => {
  return (
    <ThemeProvider theme={theme}>
      <HatchifyPresentationProvider
        List={MuiList}
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

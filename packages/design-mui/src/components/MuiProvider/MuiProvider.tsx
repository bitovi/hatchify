import type { Theme } from "@mui/material"
import type { XProviderProps } from "@hatchifyjs/react-ui"
import {
  HatchifyPresentationProvider,
  HatchifyPresentationDefaultValueComponents,
} from "@hatchifyjs/react-ui"
import { MuiLayout } from "../MuiLayout"
import MuiDataGrid from "../MuiDataGrid/MuiDataGrid"
import { MuiEverything } from "../MuiEverything"
import { Relationship, RelationshipList } from "./DefaultDisplayComponents"

export const MuiProvider: React.FC<XProviderProps<Theme>> = ({ children }) => {
  return (
    <HatchifyPresentationProvider
      Collection={MuiDataGrid}
      Everything={MuiEverything}
      Layout={MuiLayout}
      // future: Details, Form
      defaultValueComponents={{
        ...HatchifyPresentationDefaultValueComponents,
        Relationship,
        RelationshipList,
      }}
      // future: defaultFieldComponents
    >
      {children}
    </HatchifyPresentationProvider>
  )
}

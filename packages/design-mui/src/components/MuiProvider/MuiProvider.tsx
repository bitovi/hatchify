import type { Theme } from "@mui/material"
import type { XProviderProps } from "@hatchifyjs/react-ui"
import {
  HatchifyPresentationProvider,
  HatchifyPresentationDefaultValueComponents,
} from "@hatchifyjs/react-ui"
import { MuiLayout } from "../MuiLayout/index.js"
import MuiDataGrid from "../MuiDataGrid/MuiDataGrid.js"
import { MuiEverything } from "../MuiEverything/index.js"
import { MuiNavigation } from "../MuiNavigation/index.js"
import { MuiNoSchemas } from "../MuiNoSchemas/index.js"
import {
  Relationship,
  RelationshipList,
} from "./DefaultDisplayComponents/index.js"

export const MuiProvider: React.FC<XProviderProps<Theme>> = ({ children }) => {
  return (
    <HatchifyPresentationProvider
      DataGrid={MuiDataGrid}
      Everything={MuiEverything}
      Navigation={MuiNavigation}
      NoSchemas={MuiNoSchemas}
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

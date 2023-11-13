import type { Theme } from "@mui/material"
import type { XProviderProps } from "@hatchifyjs/react-ui"
import {
  HatchifyPresentationProvider,
  HatchifyPresentationDefaultValueComponents,
  HatchifyPresentationDefaultFieldComponents,
} from "@hatchifyjs/react-ui"
import { MuiLayout } from "../MuiLayout"
import { MuiForm } from "../MuiForm"
import { MuiDetails } from "../MuiDetails"
import MuiDataGrid from "../MuiDataGrid/MuiDataGrid"
import { MuiEverything } from "../MuiEverything"
import {
  String as StringInput,
  Number as NumberInput,
  Date as DateInput,
  Boolean as BooleanInput,
  Relationship as RelationshipInput,
} from "./DefaultFieldComponents"
import { Relationship, RelationshipList } from "./DefaultDisplayComponents"

export const MuiProvider: React.FC<XProviderProps<Theme>> = ({ children }) => {
  return (
    <HatchifyPresentationProvider
      Collection={MuiDataGrid}
      Everything={MuiEverything}
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
  )
}

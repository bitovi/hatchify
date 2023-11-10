import type { Meta } from "@hatchifyjs/rest-client"
import type {
  FlatRecord,
  FieldComponent,
  DataCellValueComponent,
  HeaderCellValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"
import type { HatchifyDisplay } from "../../services"
import type { FormFieldRender } from "../../services-legacy"

export type DataCellRender = ({ record }: { record: FlatRecord }) => JSX.Element
export type HeaderCellRender = (headerArgs: {
  column: Omit<HatchifyDisplay, "dataCellRender" | "headerCellRender">
  meta: Meta
  sortBy: string | undefined
  direction: "asc" | "desc" | undefined
  setSort: (sortBy: string) => void
}) => JSX.Element

export type DataCellRenderValue = ({
  value,
  record,
  attributeSchema,
}: {
  value: CellValue
  record: FlatRecord
  attributeSchema?: Attribute
}) => JSX.Element
export type HeaderCellRenderValue = (headerArgs: {
  column: Omit<HatchifyDisplay, "dataCellRender" | "headerCellRender">
  meta: Meta
  sortBy: string | undefined
  direction: "asc" | "desc" | undefined
  setSort: (sortBy: string) => void
}) => JSX.Element

export type HatchifyExtraColumnProps = {
  label: string
  after?: string
} & (
  | { render: DataCellRender }
  | {
      DataCellValueComponent: DataCellValueComponent
      HeaderCellValueComponent?: HeaderCellValueComponent
    }
)

export const HatchifyExtraColumn: React.FC<HatchifyExtraColumnProps> = () => {
  return null
}

// component is exposed to end-user as `ExtraColumn`
HatchifyExtraColumn.displayName = "ExtraColumn"

export type HatchifyEmptyListProps = {
  children: React.ReactNode
}

export const HatchifyEmptyList: React.FC<HatchifyEmptyListProps> = () => {
  return null
}

HatchifyEmptyList.displayName = "EmptyList"

export type HatchifyColumnProps = {
  attribute: string
  label?: string
} & (
  | {
      dataCellRenderValue?: DataCellRenderValue
      headerCellRenderValue?: HeaderCellRenderValue
    }
  | {
      DataCellValueComponent?: DataCellValueComponent
      HeaderCellValueComponent?: HeaderCellValueComponent
    }
)

export const HatchifyColumn: React.FC<HatchifyColumnProps> = () => {
  return null
}

HatchifyColumn.displayName = "Column"

export type HatchifyAttributeFieldProps = {
  attribute: string
  label?: string
} & ({ render?: FormFieldRender } | { FieldComponent?: FieldComponent })

export const HatchifyAttributeField: React.FC<
  HatchifyAttributeFieldProps
> = () => {
  return null
}

import type { Meta } from "@hatchifyjs/rest-client"
import type {
  FlatRecord,
  FieldComponent,
  DataValueComponent,
  HeaderValueComponent,
  DataValue,
  Attribute,
} from "../../presentation/interfaces"
import type { HatchifyDisplay } from "../../services"
import type { FormFieldRender } from "../../services-legacy"

export type DataRender = ({ record }: { record: FlatRecord }) => JSX.Element
export type HeaderRender = (headerArgs: {
  column: Omit<HatchifyDisplay, "renderData" | "renderHeader">
  meta: Meta
  sortBy: string | undefined
  direction: "asc" | "desc" | undefined
  setSort: (sortBy: string) => void
}) => JSX.Element

export type DataRenderValue = ({
  value,
  record,
  attributeSchema,
}: {
  value: DataValue
  record: FlatRecord
  attributeSchema?: Attribute
}) => JSX.Element
export type HeaderRenderValue = (headerArgs: {
  column: Omit<HatchifyDisplay, "renderData" | "renderHeader">
  meta: Meta
  sortBy: string | undefined
  direction: "asc" | "desc" | undefined
  setSort: (sortBy: string) => void
}) => JSX.Element

export type HatchifyExtraColumnProps = {
  label: string
  after?: string
} & (
  | {
      dataRender: DataRender
      headerRender: HeaderRender
    }
  | {
      DataValueComponent: DataValueComponent
      HeaderValueComponent?: HeaderValueComponent
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
      dataRenderValue?: DataRenderValue
      headerRenderValue?: HeaderRenderValue
    }
  | {
      DataValueComponent?: DataValueComponent
      HeaderValueComponent?: HeaderValueComponent
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

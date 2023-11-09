import type {
  FlatRecord,
  FieldComponent,
  ValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"
import type { FormFieldRender } from "../../services-legacy"

export type Render = ({ record }: { record: FlatRecord }) => JSX.Element

export type RenderValue = ({
  value,
  record,
  attributeSchema,
}: {
  value: CellValue
  record: FlatRecord
  attributeSchema?: Attribute
}) => JSX.Element

export type HatchifyExtraColumnProps = {
  label: string
  after?: string
} & ({ render: Render } | { ValueComponent: ValueComponent })

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
  | { dataCellRenderValue?: RenderValue; headerCellRenderValue?: RenderValue }
  | { ValueComponent?: ValueComponent }
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

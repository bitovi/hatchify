import type { Schemas } from "@hatchifyjs/rest-client"
import type {
  FlatRecord,
  ValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"

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

export type AdditionalColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & ({ renderValue: Render } | { ValueComponent: ValueComponent })

export type ReplaceColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "replace"
  label?: string
  field: string
} & ({ renderValue?: RenderValue } | { ValueComponent?: ValueComponent })

export type OverwriteColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type?: never
  label?: string
  field: string
} & ({ renderValue?: RenderValue } | { ValueComponent?: ValueComponent })

export type HatchifyColumnProps =
  | AdditionalColumnProps
  | ReplaceColumnProps
  | OverwriteColumnProps

export const HatchifyColumn: React.FC<HatchifyColumnProps> = () => {
  return null
}

HatchifyColumn.displayName = "Column"

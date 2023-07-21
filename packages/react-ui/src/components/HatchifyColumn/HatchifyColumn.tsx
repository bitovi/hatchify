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

// todo: renderValue and ValueComponent should be required, but only one can be provided
export type AdditionalColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & { renderValue?: Render; ValueComponent?: ValueComponent }

// todo: renderValue and ValueComponent should be optional, but only one can be provided
export type ReplaceColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "replace"
  label?: string
  field: string
} & { renderValue?: RenderValue; ValueComponent?: ValueComponent }

// todo: renderValue and ValueComponent should be optional, but only one can be provided
export type OverwriteColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type?: never
  label?: string
  field: string
} & { renderValue?: RenderValue; ValueComponent?: ValueComponent }

export const HatchifyColumn: React.FC<
  AdditionalColumnProps | ReplaceColumnProps | OverwriteColumnProps
> = () => {
  return null
}

HatchifyColumn.displayName = "Column"

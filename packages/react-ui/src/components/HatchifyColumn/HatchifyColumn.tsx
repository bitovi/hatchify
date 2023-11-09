import type {
  GetSchemaFromName,
  GetSchemaNames,
  Schemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
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

// todo: dataCellRenderValue and ValueComponent should be required, but only one can be provided
export type AdditionalColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & {
  dataCellRenderValue?: Render
  headerCellRenderValue?: Render
  ValueComponent?: ValueComponent
}

// todo: dataCellRenderValue and ValueComponent should be optional, but only one can be provided
export type ReplaceColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: Schemas
  schemaName: TSchemaName
  type: "replace"
  label?: string
  field: keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"] | "id"
} & {
  dataCellRenderValue?: RenderValue
  headerCellRenderValue?: RenderValue
  ValueComponent?: ValueComponent
}

// todo: dataCellRenderValue and ValueComponent should be optional, but only one can be provided
export type OverwriteColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: Schemas
  schemaName: TSchemaName
  type?: never
  label?: string
  field?: keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"] | "id"
} & {
  dataCellRenderValue?: RenderValue
  headerCellRenderValue?: RenderValue
  ValueComponent?: ValueComponent
}

export function HatchifyColumn<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  props:
    | AdditionalColumnProps
    | ReplaceColumnProps<TSchemas, TSchemaName>
    | OverwriteColumnProps<TSchemas, TSchemaName>,
): null {
  return null
}

HatchifyColumn.displayName = "Column"

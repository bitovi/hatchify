import type {
  GetSchemaFromName,
  GetSchemaNames,
  Meta,
  Schemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FlatRecord,
  DataCellValueComponent,
  HeaderCellValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"
import type { HatchifyDisplay } from "../../services"

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

// todo: dataCellRenderValue and DataCellValueComponent should be required, but only one can be provided
export type AdditionalColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & {
  dataCellRenderValue?: DataCellRender
  DataCellValueComponent?: DataCellValueComponent
  headerCellRenderValue?: HeaderCellRender
  HeaderCellValueComponent?: HeaderCellValueComponent
}

// todo: dataCellRenderValue and DataCellValueComponent should be optional, but only one can be provided
export type ReplaceColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  sortable?: boolean
  allSchemas: Schemas
  schemaName: TSchemaName
  type: "replace"
  label?: string
  field: keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"] | "id"
} & {
  dataCellRenderValue?: DataCellRenderValue
  DataCellValueComponent?: DataCellValueComponent
  headerCellRenderValue?: HeaderCellRenderValue
  HeaderCellValueComponent?: HeaderCellValueComponent
}

// todo: dataCellRenderValue and DataCellValueComponent should be optional, but only one can be provided
export type OverwriteColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  sortable?: boolean
  allSchemas: Schemas
  schemaName: TSchemaName
  type?: never
  label?: string
  field?: keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"] | "id"
} & {
  dataCellRenderValue?: DataCellRenderValue
  DataCellValueComponent?: DataCellValueComponent
  headerCellRenderValue?: HeaderCellRenderValue
  HeaderCellValueComponent?: HeaderCellValueComponent
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

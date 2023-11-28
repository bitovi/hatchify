import type {
  Meta,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  RecordType,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  DataValue,
  DataValueComponent,
  HatchifyCollectionSort,
  HeaderValueComponent,
  SortObject,
} from "../../presentation/interfaces"
import { HatchifyColumn } from "../../hooks"

export type RenderData<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = ({
  record,
}: {
  record: RecordType<
    TSchemas,
    GetSchemaFromName<TSchemas, TSchemaName>,
    false,
    true
  >
}) => JSX.Element

export type RenderHeader = (headerArgs: {
  column: Omit<
    HatchifyColumn,
    "isHeaderOverridden" | "renderData" | "renderHeader"
  >
  meta: Meta
  sortBy: SortObject["sortBy"]
  direction: SortObject["direction"]
  setSort: HatchifyCollectionSort["setSort"]
}) => JSX.Element

export type RenderDataValue<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = ({
  value,
  record,
}: // control
{
  value: DataValue // @TODO HATCH-417 - DataValue should be replaced with type of the field for this column
  // @TODO HATCH-417 - `control` for this column's field should be forwarded here
  record: RecordType<
    TSchemas,
    GetSchemaFromName<TSchemas, TSchemaName>,
    false,
    true
  >
}) => JSX.Element

// todo: renderDataValue and DataValueComponent should be required, but only one can be provided
// todo: renderHeaderValue and HeaderValueComponent should be required, but only one can be provided
export type AdditionalColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: string
  type: "append" | "prepend"
  label?: string
  field?: never
} & {
  renderDataValue?: RenderData<TSchemas, TSchemaName>
  DataValueComponent?: DataValueComponent
  renderHeaderValue?: RenderHeader
  HeaderValueComponent?: HeaderValueComponent
}

// todo: renderDataValue and DataValueComponent should be optional, but only one can be provided
// todo: renderHeaderValue and HeaderValueComponent should be optional, but only one can be provided
export type ReplaceColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  sortable?: boolean
  allSchemas: FinalSchemas
  schemaName: TSchemaName
  type: "replace"
  label?: string
  field:
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"]
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["relationships"]
    | "id"
    | ""
} & {
  renderDataValue?: RenderDataValue<TSchemas, TSchemaName>
  DataValueComponent?: DataValueComponent
  renderHeaderValue?: RenderHeader
  HeaderValueComponent?: HeaderValueComponent
}

// todo: renderDataValue and DataValueComponent should be optional, but only one can be provided
// todo: renderHeaderValue and HeaderValueComponent should be optional, but only one can be provided
export type OverwriteColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  sortable?: boolean
  allSchemas: FinalSchemas
  schemaName: TSchemaName
  type?: never
  label?: string
  field?:
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"]
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["relationships"]
    | "id"
    | ""
} & {
  renderDataValue?: RenderDataValue<TSchemas, TSchemaName>
  DataValueComponent?: DataValueComponent // @TODO HATCH-417 - not sure if this is possible to strictly type
  renderHeaderValue?: RenderHeader
  HeaderValueComponent?: HeaderValueComponent // @TODO HATCH-417 - not sure if this is possible to strictly type
}

export function HatchifyColumn<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  props:
    | AdditionalColumnProps<TSchemas, TSchemaName>
    | ReplaceColumnProps<TSchemas, TSchemaName>
    | OverwriteColumnProps<TSchemas, TSchemaName>,
): null {
  return null
}

HatchifyColumn.displayName = "Column"

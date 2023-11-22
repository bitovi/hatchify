import type {
  GetSchemaFromName,
  GetSchemaNames,
  Meta,
  Schemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FlatRecord,
  DataValueComponent,
  HeaderValueComponent,
  DataValue,
  Attribute,
  SortObject,
  HatchifyCollectionSort,
} from "../../presentation/interfaces"
import type { HatchifyDisplay } from "../../services"

export type DataRender = ({ record }: { record: FlatRecord }) => JSX.Element
export type HeaderRender = (headerArgs: {
  column: Omit<HatchifyDisplay, "renderData" | "renderHeader">
  meta: Meta
  sortBy: SortObject["sortBy"]
  direction: SortObject["direction"]
  setSort: HatchifyCollectionSort["setSort"]
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
  sortBy: SortObject["sortBy"]
  direction: SortObject["direction"]
  setSort: HatchifyCollectionSort["setSort"]
}) => JSX.Element

// todo: dataRenderValue and DataValueComponent should be required, but only one can be provided
export type AdditionalColumnProps = {
  allSchemas: Schemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & {
  dataRenderValue?: DataRender
  DataValueComponent?: DataValueComponent
  headerRenderValue?: HeaderRender
  HeaderValueComponent?: HeaderValueComponent
}

// todo: dataRenderValue and DataValueComponent should be optional, but only one can be provided
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
  dataRenderValue?: DataRenderValue
  DataValueComponent?: DataValueComponent
  headerRenderValue?: HeaderRenderValue
  HeaderValueComponent?: HeaderValueComponent
}

// todo: dataRenderValue and DataValueComponent should be optional, but only one can be provided
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
  dataRenderValue?: DataRenderValue
  DataValueComponent?: DataValueComponent
  headerRenderValue?: HeaderRenderValue
  HeaderValueComponent?: HeaderValueComponent
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

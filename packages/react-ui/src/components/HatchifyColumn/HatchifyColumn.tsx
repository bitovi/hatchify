import type {
  GetSchemaFromName,
  GetSchemaNames,
  FinalSchemas,
  RecordType,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { ValueComponent, CellValue } from "../../presentation/interfaces"

export type Render<
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

export type RenderValue<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = ({
  value,
  record,
}: // control
{
  value: CellValue // @TODO HATCH-417 - CellValue should be replaced with type of the field for this column
  // @TODO HATCH-417 - `control` for this column's field should be forwarded here
  record: RecordType<
    TSchemas,
    GetSchemaFromName<TSchemas, TSchemaName>,
    false,
    true
  >
}) => JSX.Element

// todo: renderValue and ValueComponent should be required, but only one can be provided
export type AdditionalColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: string
  type: "append" | "prepend"
  label: string
  field?: never
} & {
  renderValue?: Render<TSchemas, TSchemaName>
  ValueComponent?: ValueComponent
}

// todo: renderValue and ValueComponent should be optional, but only one can be provided
export type ReplaceColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: TSchemaName
  type: "replace"
  label?: string
  field:
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"]
    | "id"
    | ""
} & {
  renderValue?: RenderValue<TSchemas, TSchemaName>
  ValueComponent?: ValueComponent
}

// todo: renderValue and ValueComponent should be optional, but only one can be provided
export type OverwriteColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: TSchemaName
  type?: never
  label?: string
  field:
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"]
    | "id"
    | ""
} & {
  renderValue?: RenderValue<TSchemas, TSchemaName>
  ValueComponent?: ValueComponent // @TODO HATCH-417 - not sure if this is possible to strictly type
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

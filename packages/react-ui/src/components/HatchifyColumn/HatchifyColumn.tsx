import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  RecordType,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  DataValue,
  DataValueComponent,
  HeaderProps,
  HeaderValueComponent,
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

export type RenderHeader = (headerArgs: HeaderProps) => JSX.Element

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

// type RenderDataProps<
//   TSchemas extends Record<string, PartialSchema>,
//   TSchemaName extends GetSchemaNames<TSchemas>,
// > =
//   | {
//       renderDataValue?: RenderData<TSchemas, TSchemaName>
//       DataValueComponent?: never
//     }
//   | {
//       renderDataValue?: never
//       DataValueComponent?: DataValueComponent
//     }

// type RenderHeaderProps =
//   | {
//       renderHeaderValue?: RenderHeader
//       HeaderValueComponent?: never
//     }
//   | {
//       renderHeaderValue?: never
//       HeaderValueComponent?: HeaderValueComponent
//     }

// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderDataValue and DataValueComponent should be required, but only one can be provided
// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderHeaderValue and HeaderValueComponent should be required, but only one can be provided
// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderHeaderValue, HeaderValueComponent, and label should all be optional, but only one can be provided
export type ExtraColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: string
  sortable?: boolean
  prepend?: boolean
  label?: string
  field?: never
} & {
  renderDataValue?: RenderData<TSchemas, TSchemaName>
  DataValueComponent?: DataValueComponent
  renderHeaderValue?: RenderHeader
  HeaderValueComponent?: HeaderValueComponent
}
// } & RenderDataProps<TSchemas, TSchemaName> &
// RenderHeaderProps

// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderDataValue and DataValueComponent should be optional, but only one can be provided
// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderHeaderValue, HeaderValueComponent, and label should all be optional, but only one can be provided
export type CustomColumnProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = {
  allSchemas: FinalSchemas
  schemaName: TSchemaName
  sortable?: boolean
  prepend?: never
  label?: string
  field:
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["attributes"]
    | keyof GetSchemaFromName<TSchemas, TSchemaName>["relationships"]
    | "id"
    | "" // is this needed still?
} & {
  renderDataValue?: RenderDataValue<TSchemas, TSchemaName>
  DataValueComponent?: DataValueComponent
  renderHeaderValue?: RenderHeader
  HeaderValueComponent?: HeaderValueComponent
}
// } & RenderDataProps<TSchemas, TSchemaName> &
// RenderHeaderProps

// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderDataValue and DataValueComponent should be optional, but only one can be provided
// @TODO HATCH-459 - https://bitovi.atlassian.net/browse/HATCH-459 - renderHeaderValue, HeaderValueComponent, and label should all be optional, but only one can be provided
export function HatchifyColumn<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  props:
    | ExtraColumnProps<TSchemas, TSchemaName>
    | CustomColumnProps<TSchemas, TSchemaName>,
): null {
  return null
}

HatchifyColumn.displayName = "Column"

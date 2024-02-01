import { useMemo } from "react"
import type {
  Filters,
  PaginationObject,
  FinalSchemas,
  GetSchemaNames,
  Include,
  GetSchemaFromName,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type {
  HatchifyDataGridSelected,
  SortObject,
} from "../../presentation/index.js"
import { useHatchifyPresentation } from "../index.js"
import useDataGridState from "../../hooks/useDataGridState.js"

export interface HatchifyDataGridProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  schemaName: TSchemaName
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyDataGridSelected["selected"]
  onSelectedChange?: HatchifyDataGridSelected["setSelected"]
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
  overwrite?: boolean
  minimumLoadTime?: number
}

function HatchifyDataGrid<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>({
  finalSchemas,
  partialSchemas,
  schemaName,
  restClient,
  children,
  defaultSelected,
  onSelectedChange,
  defaultPage,
  defaultSort,
  baseFilter,
  overwrite,
  minimumLoadTime,
}: HatchifyDataGridProps<TSchemas, TSchemaName>): JSX.Element {
  const { DataGrid } = useHatchifyPresentation()
  const defaultInclude = useMemo(
    () =>
      getDefaultInclude<GetSchemaFromName<TSchemas, TSchemaName>>(
        finalSchemas,
        schemaName as string,
      ),
    [finalSchemas, schemaName],
  )

  const dataGridState = useDataGridState(
    finalSchemas,
    partialSchemas,
    schemaName,
    restClient,
    {
      defaultSelected,
      onSelectedChange,
      include: defaultInclude,
      defaultPage,
      defaultSort,
      baseFilter,
      minimumLoadTime,
    },
  )

  return (
    <DataGrid overwrite={overwrite} {...dataGridState}>
      {children}
    </DataGrid>
  )
}

export default HatchifyDataGrid

export function getDefaultInclude<TSchema extends PartialSchema>(
  allSchemas: FinalSchemas,
  schemaName: string,
): Include<TSchema> {
  return Object.entries(allSchemas[schemaName]?.relationships || [])
    .filter(([_, value]) => ["belongsTo", "hasOne"].includes(value.type))
    .map(([key, _]) => key) as Include<TSchema> // @todo HATCH-417
}

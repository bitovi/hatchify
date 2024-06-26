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
  HatchifyDataGridSelectedState,
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
  defaultSelected?: HatchifyDataGridSelectedState
  onSelectedChange?: (selected: HatchifyDataGridSelectedState) => void
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
  overwrite?: boolean
  minimumLoadTime?: number
  fitParent?: boolean
  alwaysSorted?: boolean
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
  fitParent,
  alwaysSorted,
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

  // console.log('HatchifyDataGrid.always')
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
      alwaysSorted,
    },
  )

  return (
    <DataGrid overwrite={overwrite} fitParent={fitParent} {...dataGridState}>
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

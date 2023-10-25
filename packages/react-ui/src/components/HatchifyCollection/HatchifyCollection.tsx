import type {
  Filters,
  PaginationObject,
  FinalSchemas,
  GetSchemaNames,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type { HatchifyCollectionSelected, SortObject } from "../../presentation"
import { useHatchifyPresentation } from ".."
import useCollectionState from "../../hooks/useCollectionState"

export interface HatchifyCollectionProps<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  schemaName: TSchemaName
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyCollectionSelected["selected"]
  onSelectedChange?: HatchifyCollectionSelected["setSelected"]
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
}

function HatchifyCollection<
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
}: HatchifyCollectionProps<TSchemas, TSchemaName>): JSX.Element {
  const { Collection } = useHatchifyPresentation()
  const defaultInclude = getDefaultInclude(finalSchemas, schemaName as string)

  const collectionState = useCollectionState(
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
    },
  )

  return <Collection {...collectionState}>{children}</Collection>
}

export default HatchifyCollection

function getDefaultInclude(allSchemas: FinalSchemas, schemaName: string) {
  return Object.entries(allSchemas[schemaName]?.relationships || [])
    .filter(([_, value]) => ["belongsTo", "hasOne"].includes(value.type))
    .map(([key, _]) => key)
}

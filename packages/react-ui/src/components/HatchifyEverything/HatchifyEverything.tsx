import { useState } from "react"
import type {
  Filters,
  PaginationObject,
  FinalSchemas,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import { useHatchifyPresentation } from ".."
import type { HatchifyCollectionSelected, SortObject } from "../../presentation"
import useCollectionState from "../../hooks/useCollectionState"

export interface HatchifyEverythingProps<
  TSchemas extends Record<string, PartialSchema>,
> {
  finalSchemas: FinalSchemas
  partialSchemas: TSchemas
  restClient: HatchifyReactRest<TSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyCollectionSelected["selected"]
  onSelectedChange?: HatchifyCollectionSelected["setSelected"]
  defaultPage?: PaginationObject
  defaultSort?: SortObject
  baseFilter?: Filters
}

function HatchifyEverything<
  const TSchemas extends Record<string, PartialSchema>,
>({
  finalSchemas,
  partialSchemas,
  restClient,
  children,
  defaultSelected,
  onSelectedChange,
  defaultPage,
  defaultSort,
  baseFilter,
}: HatchifyEverythingProps<TSchemas>): JSX.Element {
  console.log(
    "rest defaultSelected ",
    defaultSelected,
    defaultPage,
    defaultSort,
    baseFilter,
  )
  const schemasList = Object.keys(finalSchemas)
  const [selectedSchema, setSelectedSchema] = useState(schemasList[0])
  const { Everything } = useHatchifyPresentation()

  const collectionState = useCollectionState(
    finalSchemas,
    partialSchemas,
    selectedSchema,
    restClient,
    {
      defaultSelected,
      onSelectedChange,
      defaultPage,
      defaultSort,
      baseFilter,
    },
  )

  return (
    <Everything
      {...collectionState}
      schemaName={selectedSchema}
      setSelectedSchema={setSelectedSchema}
    />
  )
}

HatchifyEverything.displayName = "Everything"

export default HatchifyEverything

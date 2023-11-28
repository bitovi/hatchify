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
import type { GetSchemaNames } from "@hatchifyjs/rest-client"

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
>({ finalSchemas, ...rest }: HatchifyEverythingProps<TSchemas>): JSX.Element {
  return (
    <>
      {JSON.stringify(finalSchemas) !== "{}" ? (
        <HatchifyEverythingWithSchema {...rest} finalSchemas={finalSchemas} />
      ) : (
        <HatchifyEverythingNoSchema />
      )}
    </>
  )
}

function HatchifyEverythingNoSchema(): JSX.Element {
  const { Everything } = useHatchifyPresentation()

  return <Everything />
}

function HatchifyEverythingWithSchema<
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
  const schemasList = Object.keys(finalSchemas) as Array<
    GetSchemaNames<TSchemas>
  >

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
      schemaName={selectedSchema as string}
      setSelectedSchema={setSelectedSchema}
    />
  )
}

HatchifyEverything.displayName = "Everything"

export default HatchifyEverything

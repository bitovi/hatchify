import type { FinalSchemas, PartialSchemas } from "@hatchifyjs/rest-client"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type { HatchifyCollectionSelected } from "../../presentation"
import { useHatchifyPresentation } from ".."
import useCollectionState from "../../hooks/useCollectionState"

export interface HatchifyCollectionProps {
  finalSchemas: FinalSchemas
  partialSchemas: PartialSchemas
  schemaName: string
  restClient: HatchifyReactRest<PartialSchemas>
  children?: React.ReactNode | null
  defaultSelected?: HatchifyCollectionSelected["selected"]
  onSelectedChange?: HatchifyCollectionSelected["setSelected"]
}

export const HatchifyCollection: React.FC<HatchifyCollectionProps> = ({
  finalSchemas,
  partialSchemas,
  schemaName,
  restClient,
  children,
  defaultSelected,
  onSelectedChange,
}) => {
  const { Collection } = useHatchifyPresentation()
  // todo: relationships not implemented in v2 yet
  // const defaultInclude = getDefaultInclude(allSchemas, schemaName)
  const collectionState = useCollectionState(
    finalSchemas,
    partialSchemas,
    schemaName,
    restClient,
    {
      defaultSelected,
      onSelectedChange,
      // include: defaultInclude,
    },
  )

  return <Collection {...collectionState}>{children}</Collection>
}

export default HatchifyCollection

// function getDefaultInclude(allSchemas: Schemas, schemaName: string) {
//   return Object.entries(allSchemas[schemaName]?.relationships || [])
//     .filter(([_, value]) => value.type === "one")
//     .map(([key, _]) => key)
// }

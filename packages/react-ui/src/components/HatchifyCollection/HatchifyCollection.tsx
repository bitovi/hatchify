import type { Schemas } from "@hatchifyjs/rest-client"
import type { ReactRest } from "@hatchifyjs/react-rest"
import { useHatchifyPresentation } from ".."
import useCollectionState from "../../hooks/useCollectionState"

export interface HatchifyCollectionProps {
  allSchemas: Schemas
  schemaName: string
  restClient: ReactRest<Schemas>
  children?: React.ReactNode | null
  defaultSelected?: string[]
  onSelectedChange?: (ids: string[]) => void
}

export const HatchifyCollection: React.FC<HatchifyCollectionProps> = ({
  allSchemas,
  schemaName,
  restClient,
  children,
  defaultSelected,
  onSelectedChange,
}) => {
  const { Collection } = useHatchifyPresentation()
  const defaultInclude = getDefaultInclude(allSchemas, schemaName)
  const collectionState = useCollectionState(
    allSchemas,
    schemaName,
    restClient,
    {
      selectedDefault: defaultSelected,
      onSelectedChange,
      include: defaultInclude,
    },
  )

  return <Collection {...collectionState}>{children}</Collection>
}

export default HatchifyCollection

function getDefaultInclude(allSchemas: Schemas, schemaName: string) {
  return Object.entries(allSchemas[schemaName]?.relationships || [])
    .filter(([_, value]) => value.type === "one")
    .map(([key, _]) => key)
}

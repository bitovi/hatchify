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
  const collectionState = useCollectionState(
    allSchemas,
    schemaName,
    restClient,
    defaultSelected,
    onSelectedChange,
  )

  return <Collection {...collectionState}>{children}</Collection>
}

export default HatchifyCollection

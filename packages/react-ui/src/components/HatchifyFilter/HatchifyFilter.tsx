import type { Schemas } from "@hatchifyjs/rest-client"
import { useHatchifyPresentation } from ".."

export interface HatchifyFilterProps {
  allSchemas: Schemas
  schemaName: string
}

export const HatchifyFilter: React.FC<HatchifyFilterProps> = ({
  allSchemas,
  schemaName,
}) => {
  const { Filter } = useHatchifyPresentation()

  return (
    <Filter
      schemas={allSchemas}
      schemaName={schemaName}
      filters=""
      setFilters={(value) => console.log("filters", value)}
    />
  )
}

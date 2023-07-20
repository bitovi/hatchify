import type { Schemas } from "@hatchifyjs/rest-client"
import { useHatchifyPresentation } from ".."

export interface HatchifyFilterProps {
  allSchemas: Schemas
  schemaName: string
  filters: { [key: string]: string }
  setFilters: (filterBy: { [key: string]: string }) => void
}

export const HatchifyFilter: React.FC<HatchifyFilterProps> = ({
  allSchemas,
  schemaName,
  filters,
  setFilters,
}) => {
  const { Filter } = useHatchifyPresentation()

  return (
    <Filter
      schemas={allSchemas}
      schemaName={schemaName}
      filters={filters}
      setFilters={(value: { [key: string]: string }) => setFilters(value)}
    />
  )
}

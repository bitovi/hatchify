import type { Filter, Schemas } from "@hatchifyjs/rest-client"
import { useHatchifyPresentation } from ".."

export interface HatchifyFilterProps {
  allSchemas: Schemas
  children: React.ReactElement
  schemaName: string
  filters: Filter
  setFilters: (filterBy: Filter) => void
}

export const HatchifyFilter: React.FC<HatchifyFilterProps> = ({
  allSchemas,
  children,
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
      setFilters={(value: Filter) => setFilters(value)}
    >
      {children}
    </Filter>
  )
}

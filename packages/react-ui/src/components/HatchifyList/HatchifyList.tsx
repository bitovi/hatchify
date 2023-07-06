import type { Meta, QueryList, Record, Schemas } from "@hatchifyjs/rest-client"
import type { ValueComponent } from "../../presentation/interfaces"
import useHatchifyListSort from "./hooks/useHatchifyListSort"
import { getDisplays } from "../../services"
import { useHatchifyPresentation } from ".."
import { useCallback } from "react"

export interface HatchifyListProps {
  allSchemas: Schemas
  schemaName: string
  useData: (query: QueryList) => [Record[], Meta]
  valueComponents?: { [attribute: string]: ValueComponent }
  children?: React.ReactNode | null
}

export const HatchifyList: React.FC<HatchifyListProps> = ({
  allSchemas,
  schemaName,
  valueComponents,
  useData,
  children,
}) => {
  const { List, defaultValueComponents } = useHatchifyPresentation()
  const { sort, setSort, sortQueryString } = useHatchifyListSort()

  // TODO: Make this better @Arthur
  const useDataCallback = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useData({ sort: sortQueryString })
  }, [useData, sortQueryString])

  const displays = getDisplays(
    allSchemas[schemaName],
    valueComponents,
    defaultValueComponents,
    children,
  )

  return (
    <List
      displays={displays}
      useData={useDataCallback}
      sort={sort}
      setSort={setSort}
    />
  )
}

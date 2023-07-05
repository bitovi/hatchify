import type { Meta, QueryList, Record, Schemas } from "@hatchifyjs/rest-client"
import type { ValueComponent } from "../../presentation/interfaces"
import { useHatchifyListSort } from "./UseHatchifyListSort"
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
  const { changeSort, sortQueryString, sort } = useHatchifyListSort()

  //TODO: Make this better @Arthur
  const fetchList = useCallback(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const response = useData({ sort: sortQueryString })
    return response
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
      useData={fetchList}
      changeSort={changeSort}
      sort={sort}
    />
  )
}

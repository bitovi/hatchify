// import type { Schema } from "@hatchifyjs/hatchify-core"
import type { Schema } from "../../services/api/schemas" //TODO update schema

import { getDisplays } from "../../services"
import { useHatchifyPresentation } from ".."

import type { FlatRecord, ValueComponent } from "../../presentation/interfaces"
import type { Meta, QueryList, Record } from "@hatchifyjs/rest-client"

export interface HatchifyListProps {
  schema: Schema
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord[]
  children?: React.ReactNode | null
  useList: (query: QueryList) => [Record[], Meta]
}

export const HatchifyList: React.FC<HatchifyListProps> = ({
  schema,
  valueComponents,
  useData,
  useList,
  children,
}) => {
  const { List, defaultValueComponents } = useHatchifyPresentation()
  const displays = getDisplays(
    schema,
    valueComponents,
    defaultValueComponents,
    children,
  )

  // @TODO implement this in a better way when data layer is implemented
  if (!useData) {
    // const resource = getMany(schema)
    useData = () => [] //resource.read()
  }

  return <List displays={displays} useData={useList} />
}

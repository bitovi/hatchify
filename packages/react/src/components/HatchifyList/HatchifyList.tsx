// import type { Schema } from "@hatchifyjs/data-core"
import type { Schema } from "../../services/api/schemas" //TODO update schema

import { getDisplays } from "../../services";
import { useHatchifyPresentation } from "..";

import type { FlatRecord, ValueComponent } from "../../presentation/interfaces";

interface HatchifyListProps {
  schema: Schema
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord[]
  children?: React.ReactNode | null
}

export const HatchifyList: React.FC<HatchifyListProps> = ({
  schema,
  valueComponents,
  useData,
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

  return <List displays={displays} useData={useData} />
}

export default HatchifyList

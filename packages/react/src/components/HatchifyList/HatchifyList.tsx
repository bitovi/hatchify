import { getDisplays } from "../../services/displays/hatchifyDisplays";
import { useHatchifyPresentation } from "../HatchifyPresentationProvider";

import type { FlatRecord, Schema, ValueComponent } from "../../presentation/interfaces";

interface HatchifyListProps {
  schema: Schema
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord[]
  children?: React.ReactNode | null
}

const HatchifyList: React.FC<HatchifyListProps> = ({
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

  // @todo implement this in a better way when data layer is implemented
  if (!useData) {
    // const resource = getMany(schema)
    useData = () => [] //resource.read()
  }

  return <List displays={displays} useData={useData} />
}

export default HatchifyList
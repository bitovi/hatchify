import { useParams } from "react-router-dom"
// import type { Schema } from "@hatchifyjs/rest-client"

import { getOne } from "../../services/api/api"
import { useHatchifyPresentation } from ".."
import { getDisplays } from "../../services"

import type { Schema } from "../../services/api/schemas" //TODO update schema

import type { FlatRecord, ValueComponent } from "../../presentation/interfaces"

interface HatchifyDetailsProps {
  schema: Schema
  valueComponents?: { [attribute: string]: ValueComponent }
  useData?: () => FlatRecord
  children?: React.ReactNode | null
}

export const HatchifyDetails: React.FC<HatchifyDetailsProps> = ({
  schema,
  valueComponents,
  useData,
  children,
}) => {
  const { id } = useParams<{ id: string }>()
  const { Details, defaultValueComponents } = useHatchifyPresentation()
  const displays = getDisplays(
    schema,
    valueComponents,
    defaultValueComponents,
    children,
  )

  if (!useData) {
    const resource = getOne(schema, id as string)
    useData = () => resource.read()
  }

  return <Details displays={displays} useData={useData} />
}

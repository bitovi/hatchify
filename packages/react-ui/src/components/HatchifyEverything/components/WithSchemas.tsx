import { useMemo, useState } from "react"
import type { PartialSchema } from "@hatchifyjs/core"
import type { GetSchemaNames, Include } from "@hatchifyjs/rest-client"
import { useCollectionState } from "../../../hooks"
import { getDefaultInclude } from "../../HatchifyCollection"
import { useHatchifyPresentation } from "../../HatchifyPresentationProvider"
import type { HatchifyEverythingProps } from "../HatchifyEverything"

type DefaultIncludes<TPartialSchemas extends Record<string, PartialSchema>> = {
  [SchemaName in keyof TPartialSchemas]: Include<TPartialSchemas[SchemaName]>
}

export function WithSchemas<
  const TSchemas extends Record<string, PartialSchema>,
>({
  finalSchemas,
  partialSchemas,
  restClient,
  children,
  defaultSelected,
  onSelectedChange,
  defaultPage,
  defaultSort,
  baseFilter,
}: HatchifyEverythingProps<TSchemas>): JSX.Element {
  const schemasList = Object.keys(finalSchemas) as Array<
    GetSchemaNames<TSchemas>
  >

  const defaultIncludes = useMemo(
    () =>
      Object.keys(finalSchemas).reduce((acc, schemaName) => {
        return {
          ...acc,
          [schemaName]: getDefaultInclude(finalSchemas, schemaName),
        }
      }, {} as DefaultIncludes<TSchemas>),
    [finalSchemas],
  )

  const [selectedSchema, setSelectedSchema] = useState(schemasList[0])
  const { Everything } = useHatchifyPresentation()

  const collectionState = useCollectionState(
    finalSchemas,
    partialSchemas,
    selectedSchema,
    restClient,
    {
      defaultSelected,
      onSelectedChange,
      defaultPage,
      defaultSort,
      baseFilter,
      include: defaultIncludes[selectedSchema],
    },
  )

  return (
    <Everything
      {...collectionState}
      schemaName={selectedSchema as string}
      setSelectedSchema={setSelectedSchema}
    />
  )
}

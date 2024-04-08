import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
} from "@hatchifyjs/rest-client"
import type { DefaultDisplayComponentsTypes } from "../../../components/index.js"
import type { HatchifyColumn } from "../useCompoundComponents.js"
import { getColumn } from "./index.js"
import { getDisplayAttribute } from "@hatchifyjs/rest-client"

export function getColumnsFromSchema<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  finalSchemas: FinalSchemas,
  schemaName: TSchemaName,
  defaultDisplayComponents: DefaultDisplayComponentsTypes,
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): HatchifyColumn[] {
  const schema = finalSchemas[schemaName as string]

  const attributesDisplays = Object.entries(schema.attributes)
    .filter(([, { control }]) => control.hidden !== true)
    .map(([attributeName, { control }]) => {
      return getColumn<TSchemas, TSchemaName>({
        finalSchemas,
        schemaName,
        defaultDisplayComponents,
        control,
        field: attributeName,
        isRelationship: false,
        key: attributeName,
        compoundComponentProps: {},
      })
    })

  // do not need to show many relationships by default at the moment

  const oneRelationshipDisplays = Object.entries(schema?.relationships || {})
    .filter(([key, relationship]) => {
      return (
        include &&
        (include as string[]).includes(key) &&
        (relationship.type === "belongsTo" || relationship.type === "hasOne")
      )
    })
    .map(([key, relationship]) => {
      const relatedSchema = finalSchemas[relationship.targetSchema]
      const displayAttribute = getDisplayAttribute(relatedSchema)

      return getColumn<TSchemas, TSchemaName>({
        finalSchemas,
        schemaName,
        defaultDisplayComponents,
        control: null,
        field: key,
        key: `${key}.${displayAttribute}`,
        isRelationship: true,
        compoundComponentProps: {},
        sortable: true,
      })
    })

  return [...attributesDisplays, ...oneRelationshipDisplays]
}

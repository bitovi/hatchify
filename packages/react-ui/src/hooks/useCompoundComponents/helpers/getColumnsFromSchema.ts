import type { FinalSchemas } from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"
import type { HatchifyColumn } from "../useCompoundComponents"
import { getColumn } from "."

export function getColumnsFromSchema(
  finalSchemas: FinalSchemas,
  schemaName: string,
  defaultValueComponents: DefaultValueComponentsTypes,
): HatchifyColumn[] {
  const schema = finalSchemas[schemaName]

  const attributesDisplays = Object.entries(schema.attributes)
    .filter(([, { control }]) => control.hidden !== true)
    .map(([attributeName, { control }]) => {
      return getColumn({
        finalSchemas,
        schemaName,
        defaultValueComponents,
        control,
        field: attributeName,
        isRelationship: false,
        compoundComponentProps: {},
      })
    })

  // do not need to show many relationships by default at the moment

  const oneRelationshipDisplays = Object.entries(schema?.relationships || {})
    .filter(([key, relationship]) => {
      return relationship.type === "belongsTo" || relationship.type === "hasOne"
    })
    .map(([key, relationship]) => {
      // related schema = schema[relationship.schema]
      return getColumn({
        finalSchemas,
        schemaName,
        defaultValueComponents,
        control: null,
        field: key,
        isRelationship: true,
        compoundComponentProps: {},
      })
    })

  return [...attributesDisplays, ...oneRelationshipDisplays]
}

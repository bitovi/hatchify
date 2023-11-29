import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
} from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"
import type { HatchifyColumn } from "../useCompoundComponents"
import { getColumn } from "."

export function getColumnsFromSchema<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  finalSchemas: FinalSchemas,
  schemaName: TSchemaName,
  defaultValueComponents: DefaultValueComponentsTypes,
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): HatchifyColumn[] {
  const schema = finalSchemas[schemaName as string]

  const attributesDisplays = Object.entries(schema.attributes)
    .filter(([, { control }]) => control.hidden !== true)
    .map(([attributeName, { control }]) => {
      return getColumn<TSchemas, TSchemaName>({
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
      return (
        include &&
        (include as string[]).includes(key) &&
        (relationship.type === "belongsTo" || relationship.type === "hasOne")
      )
    })
    .map(([key, relationship]) => {
      // related schema = schema[relationship.schema]
      return getColumn<TSchemas, TSchemaName>({
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

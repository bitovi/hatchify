import { Children as ReactChildren } from "react"
import cloneDeep from "lodash/cloneDeep"
import { v4 as uuidv4 } from "uuid"
// import type { Schema} from "@hatchifyjs/rest-client"
import type { Schema } from "../api/schemas" //TODO update to the right schema

import { HatchifyColumn, HatchifyExtraColumn } from "../../components"

import type {
  Attribute,
  Relationship as RelationshipType,
  FlatRecord,
  ValueComponent,
} from "../../presentation/interfaces"

import type {
  Render,
  RenderValue,
  DefaultValueComponentsTypes,
} from "../../components"

export interface HatchifyDisplay {
  key: string
  label: string
  render: ({ record }: { record: FlatRecord }) => React.ReactNode
}

export function getDefaultDisplayRender(
  attribute: string,
  attributeType: string,
  defaultValueComponents: DefaultValueComponentsTypes,
): ({ record }: { record: FlatRecord }) => React.ReactNode {
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultValueComponents

  // @todo primitive lists?
  const defaultRender = ({ record }: { record: FlatRecord }) => {
    const value = record[attribute]
    if (attributeType === "date" && typeof value === "string") {
      return <Date dateOnly={false} value={value} />
    }

    if (attributeType === "string" && typeof value === "string") {
      return <String value={value} />
    }

    if (attributeType === "boolean" && typeof value === "boolean") {
      return <Boolean value={value} />
    }

    if (attributeType === "number" && typeof value === "number") {
      return <Number value={value} />
    }

    // @todo <HatchifyAttributeDisplay/> with relationship category|user|filetype is coming through as "extra" rather than "relationship"
    if (attributeType === "relationship" || attributeType === "extra") {
      return Array.isArray(value) ? (
        <RelationshipList values={value} />
      ) : (
        <Relationship value={value as RelationshipType} />
      )
    }

    // fallback
    return <String value=" " />
  }

  return defaultRender
}

export function getDisplaysFromChildren(
  schema: Schema,
  defaultValueComponents: DefaultValueComponentsTypes,
  children: JSX.Element[],
): HatchifyDisplay[] {
  const displays = children
    .filter((child) => child.type.name === HatchifyColumn.name)
    .map((child) => {
      const { props } = child
      const relationship = [
        ...(schema?.hasMany || []),
        ...(schema?.hasOne || []),
      ].find((relationship) => {
        return relationship.target === props.attribute
      })

      return getHatchifyDisplay({
        isRelationship: relationship !== undefined,
        attribute: props.attribute,
        label: props.label,
        attributeSchema: relationship
          ? null
          : schema.attributes[props.attribute],
        DataCellValueComponent: props.DataCellValueComponent,
        defaultValueComponents,
        dataCellRenderValue: props.dataCellRenderValue,
        headerCellRenderValue: props.headerCellRenderValue,
      })
    })

  return displays
}

export function getDisplaysFromSchema(
  schema: Schema,
  defaultValueComponents: DefaultValueComponentsTypes,
  dataCellValueComponents: {
    [attribute: string]: ValueComponent
  } | null,
): HatchifyDisplay[] {
  const attributesDisplays = Object.entries(schema.attributes).map(
    ([key, value]) => {
      return getHatchifyDisplay({
        attribute: key,
        attributeSchema: value,
        dataCellValueComponents,
        defaultValueComponents,
      })
    },
  )

  const hasManyDisplays = Object.values(schema?.hasMany || []).map((value) => {
    return getHatchifyDisplay({
      isRelationship: true,
      attribute: value.target,
      label: value.target,
      attributeSchema: null, // the schema in this case is a "relationship"
      dataCellValueComponents,
      defaultValueComponents,
    })
  })

  const hasOneDisplays = Object.values(schema?.hasOne || []).map((value) => {
    return getHatchifyDisplay({
      isRelationship: true,
      attribute: value.target,
      label: value.target,
      attributeSchema: null, // the schema in this case is a "relationship"
      dataCellValueComponents,
      defaultValueComponents,
    })
  })

  return [...attributesDisplays, ...hasManyDisplays, ...hasOneDisplays]
}

// @todo refactor the logic around render in this function
export function getHatchifyDisplay({
  attribute,
  isRelationship = false,
  isExtraDisplay = false, // @todo necessary? should always be covered by `render` or `DataCellValueComponent` case!
  label = null,
  attributeSchema = null,
  DataCellValueComponent = null,
  dataCellValueComponents = null,
  defaultValueComponents,
  render = null,
  dataCellRenderValue = null,
  headerCellRenderValue = null,
}: {
  isRelationship?: boolean
  isExtraDisplay?: boolean
  attribute: string
  label?: string | null
  attributeSchema?: Attribute | null
  DataCellValueComponent?: ValueComponent | null
  dataCellValueComponents?: {
    [attribute: string]: ValueComponent
  } | null
  defaultValueComponents: DefaultValueComponentsTypes
  render?: Render | null
  dataCellRenderValue?: RenderValue | null
  headerCellRenderValue?: RenderValue | null
}): HatchifyDisplay {
  if (!attributeSchema) {
    attributeSchema = { type: "extra", allowNull: true }
  }

  if (typeof attributeSchema === "string") {
    attributeSchema = { type: attributeSchema, allowNull: true }
  }

  if (isRelationship) {
    attributeSchema = { type: "relationship", allowNull: true }
  }

  const display: HatchifyDisplay = {
    key: attribute || uuidv4(),
    label:
      label ||
      attribute // convert to "Title Case"
        .replace(/(^\w)/g, (g) => g[0].toUpperCase())
        .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
        .trim(),
    render: () => null,
  }

  /**
   * cell render priority:
   * 1. `dataCellRenderValue` prop from `HatchifyExtraColumn` or `HatchifyAttributeDisplay`
   * 2. `DataCellValueComponent` prop from `HatchifyExtraColumn` or `HatchifyAttributeDisplay`
   * 3. `valueComponents` prop from `HatchifyList`
   * 6. default `render` using presentation's defaultvalueComponents
   */

  if (render) {
    display.render = ({ record }) => render({ record })
  } else if (dataCellRenderValue) {
    display.render = ({ record }) =>
      dataCellRenderValue({ record, value: record[attribute] })
  } else if (DataCellValueComponent) {
    display.render = ({ record }) => (
      <DataCellValueComponent
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
        attribute={attribute}
      />
    )
  } else if (dataCellValueComponents && dataCellValueComponents[attribute]) {
    const RenderCell = dataCellValueComponents[attribute]
    display.render = ({ record }) => (
      <RenderCell
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
      />
    )
  } else {
    display.render = getDefaultDisplayRender(
      attribute,
      attributeSchema.type,
      defaultValueComponents,
    )
  }

  return display
}

export function injectExtraDisplays(
  displays: HatchifyDisplay[],
  defaultValueComponents: DefaultValueComponentsTypes,
  children: JSX.Element[],
): HatchifyDisplay[] {
  const updatedDisplays = cloneDeep(displays)

  for (let i = 0; i < children.length; i++) {
    if (children[i].type.name !== HatchifyExtraColumn.name) {
      continue
    }
    const { props } = children[i]

    // @todo add according to props.after property
    updatedDisplays.push(
      getHatchifyDisplay({
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.render,
        DataCellValueComponent: props.DataCellValueComponent,
        defaultValueComponents,
      }),
    )
  }

  return updatedDisplays
}

export function hasValidChildren(
  name: string,
  children: JSX.Element[],
): boolean {
  return children.some((child) => child.type.name === name)
}

export function getDisplays(
  schema: Schema,
  dataCellValueComponents: { [field: string]: ValueComponent } | undefined,
  headerCellValueComponents: { [field: string]: ValueComponent } | undefined,
  defaultValueComponents: DefaultValueComponentsTypes,
  children: React.ReactNode | null,
): HatchifyDisplay[] {
  // casting as JSX.Element because helper functions require access to
  // `child.type.name` and `child.props`
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  let displays = hasValidChildren(HatchifyColumn.name, childArray)
    ? getDisplaysFromChildren(schema, defaultValueComponents, childArray)
    : getDisplaysFromSchema(
        schema,
        defaultValueComponents,
        dataCellValueComponents || null,
      )

  if (hasValidChildren(HatchifyExtraColumn.name, childArray)) {
    displays = injectExtraDisplays(displays, defaultValueComponents, childArray)
  }

  return displays
}

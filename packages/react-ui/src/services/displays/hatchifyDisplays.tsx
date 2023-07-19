import { Children as ReactChildren } from "react"
import cloneDeep from "lodash/cloneDeep"
import { v4 as uuidv4 } from "uuid"
import type { Attribute, Record, Schema } from "@hatchifyjs/rest-client"

import {
  HatchifyColumn,
  HatchifyExtraColumn,
  HatchifyEmptyList,
} from "../../components"

import type {
  // Attribute,
  Relationship as RelationshipType,
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
  render: ({ record }: { record: Record }) => React.ReactNode
}

export function getDefaultDisplayRender(
  attribute: string,
  attributeType: string,
  defaultValueComponents: DefaultValueComponentsTypes,
): ({ record }: { record: Record }) => React.ReactNode {
  const attType = attributeType.toLowerCase()
  const { String, Number, Boolean, Relationship, RelationshipList, Date } =
    defaultValueComponents

  // @todo primitive lists?
  const defaultRender = ({ record }: { record: Record }) => {
    const value = record[attribute]

    if (attType === "date" && typeof value === "string") {
      return <Date value={value} />
    }

    if (attType === "string" && typeof value === "string") {
      return <String value={value} />
    }

    if (attType === "boolean" && typeof value === "boolean") {
      return <Boolean value={value} />
    }

    if (attType === "number" && typeof value === "number") {
      return <Number value={value} />
    }

    // @todo <HatchifyColumn/> with relationship category|user|filetype is coming through as "extra" rather than "relationship"
    if (attType === "relationship" || attType === "extra") {
      if (!value) {
        return <String value="" />
      }

      // todo: __label is set at `react-rest` level - ideally this package is responsible for figuring out label via displayAttribute
      value.label = value.__label || value.id

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
    .filter((child) => child.type.name === HatchifyColumn.displayName)
    .map((child) => {
      const { props } = child
      const relationship = schema?.relationships?.[props.attribute]

      return getHatchifyDisplay({
        isRelationship: relationship !== undefined,
        attribute: props.attribute,
        label: props.label,
        attributeSchema: relationship
          ? null
          : schema.attributes[props.attribute],
        ValueComponent: props.ValueComponent,
        defaultValueComponents,
        renderValue: props.renderValue,
      })
    })

  return displays
}

export function getDisplaysFromSchema(
  schema: Schema,
  defaultValueComponents: DefaultValueComponentsTypes,
  valueComponents: { [attribute: string]: ValueComponent } | null,
): HatchifyDisplay[] {
  const attributesDisplays = Object.entries(schema.attributes).map(
    ([key, value]) => {
      return getHatchifyDisplay({
        attribute: key,
        attributeSchema: value,
        valueComponents,
        defaultValueComponents,
      })
    },
  )

  const manyRelationshipDisplays = Object.entries(schema?.relationships || {})
    .filter(([key, relationship]) => {
      return relationship.type === "many"
    })
    .map(([key, relationship]) => {
      // related schema = schema[relationship.schema]
      return getHatchifyDisplay({
        isRelationship: true,
        attribute: key,
        label: key,
        attributeSchema: null, // the schema in this case is a "relationship"
        valueComponents,
        defaultValueComponents,
      })
    })

  const oneRelationshipDisplays = Object.entries(schema?.relationships || {})
    .filter(([key, relationship]) => {
      return relationship.type === "one"
    })
    .map(([key, relationship]) => {
      // related schema = schema[relationship.schema]
      return getHatchifyDisplay({
        isRelationship: true,
        attribute: key,
        label: key,
        attributeSchema: null, // the schema in this case is a "relationship"
        valueComponents,
        defaultValueComponents,
      })
    })

  return [
    ...attributesDisplays,
    ...manyRelationshipDisplays,
    ...oneRelationshipDisplays,
  ]
}

// @todo refactor the logic around render in this function
export function getHatchifyDisplay({
  attribute,
  isRelationship = false,
  isExtraDisplay = false, // @todo necessary? should always be covered by `render` or `ValueComponent` case!
  label = null,
  attributeSchema = null,
  ValueComponent = null,
  valueComponents = null,
  defaultValueComponents,
  render = null,
  renderValue = null,
}: {
  isRelationship?: boolean
  isExtraDisplay?: boolean
  attribute: string
  label?: string | null
  attributeSchema?: Attribute | null
  ValueComponent?: ValueComponent | null
  valueComponents?: { [attribute: string]: ValueComponent } | null
  defaultValueComponents: DefaultValueComponentsTypes
  render?: Render | null
  renderValue?: RenderValue | null
}): HatchifyDisplay {
  if (!attributeSchema) {
    attributeSchema = { type: "extra" }
  }

  if (typeof attributeSchema === "string") {
    attributeSchema = { type: attributeSchema }
  }

  if (isRelationship) {
    attributeSchema = { type: "relationship" }
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
   * 1. `renderValue` prop from `HatchifyExtraColumn` or `HatchifyColumn`
   * 2. `ValueComponent` prop from `HatchifyExtraColumn` or `HatchifyColumn`
   * 3. `valueComponents` prop from `HatchifyList`
   * 6. default `render` using presentation's defaultvalueComponents
   */

  if (render) {
    display.render = ({ record }) => render({ record })
  } else if (renderValue) {
    display.render = ({ record }) =>
      renderValue({ record, value: record[attribute] })
  } else if (ValueComponent) {
    display.render = ({ record }) => (
      <ValueComponent
        value={record[attribute]}
        record={record}
        attributeSchema={attributeSchema}
        attribute={attribute}
      />
    )
  } else if (valueComponents && valueComponents[attribute]) {
    const RenderCell = valueComponents[attribute]
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
    if (children[i].type.name !== HatchifyExtraColumn.displayName) continue
    const { props } = children[i]
    // @todo add according to props.after property
    updatedDisplays.push(
      getHatchifyDisplay({
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.render,
        ValueComponent: props.ValueComponent,
        defaultValueComponents,
      }),
    )
  }

  return updatedDisplays
}

export function hasValidChildren(
  displayName: string,
  children: JSX.Element[],
): boolean {
  return children.some((child) => child.type.name === displayName)
}

export function getDisplays(
  schema: Schema,
  valueComponents: { [field: string]: ValueComponent } | undefined,
  defaultValueComponents: DefaultValueComponentsTypes,
  children: React.ReactNode | null,
): HatchifyDisplay[] {
  // casting as JSX.Element because helper functions require access to
  // `child.type.name` and `child.props`
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  let displays = hasValidChildren(HatchifyColumn.displayName || "", childArray)
    ? getDisplaysFromChildren(schema, defaultValueComponents, childArray)
    : getDisplaysFromSchema(
        schema,
        defaultValueComponents,
        valueComponents || null,
      )
  if (hasValidChildren(HatchifyExtraColumn.displayName || "", childArray)) {
    displays = injectExtraDisplays(displays, defaultValueComponents, childArray)
  }
  return displays
}

export function getEmptyList(children: React.ReactNode): () => JSX.Element {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  const emptyChild = childArray.find(
    (child) => child.type.name === HatchifyEmptyList.displayName,
  )

  const emptyDisplay: JSX.Element = emptyChild?.props.children || undefined

  const EmptyList = () => {
    return emptyDisplay || <div>There are no rows of data to display</div>
  }

  return EmptyList
}

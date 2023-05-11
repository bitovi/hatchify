
import { Children as ReactChildren } from "react"
import { hasValidChildren } from "../displays/hatchifyDisplays"

import type { Schema } from "data-core";
import type { AttributeSchema, Primitive, FieldComponent } from "../../presentation/interfaces";
import type {DefaultFieldComponentsTypes} from "../../components";

export type FormFieldValueType = Primitive | string[]

export type FormFieldRender = ({
  value,
  label,
  onUpdate,
}: {
  value: FormFieldValueType
  label: string
  onUpdate: (value: FormFieldValueType) => void
}) => JSX.Element

export interface HatchifyFormField {
  key: string
  label: string
  attributeSchema: AttributeSchema
  render: FormFieldRender
}



export async function getFormFields(
  schema: Schema,
  fieldComponents: { [attribute: string]: FieldComponent },
  defaultFieldComponents: DefaultFieldComponentsTypes,
  children: React.ReactNode | null,
): Promise<HatchifyFormField[]> {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  return hasValidChildren(HatchifyAttributeField.name, childArray)
    ? getFormFieldsFromChildren(schema, defaultFieldComponents, childArray)
    : getFormFieldsFromSchema(schema, defaultFieldComponents, fieldComponents)
}
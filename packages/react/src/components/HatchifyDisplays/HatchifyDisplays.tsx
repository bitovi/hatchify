import type {
  FlatRecord,
  FieldComponent,
  ValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"
import type {FormFieldRender} from "../../services";

export type Render = ({ record }: { record: FlatRecord }) => JSX.Element

export type RenderValue = ({
  value,
  record,
  attributeSchema,
}: {
  value: CellValue
  record: FlatRecord
  attributeSchema?: Attribute
}) => JSX.Element

export type HatchifyExtraDisplayProps = {
  label: string
  after?: string
} & ({ render: Render } | { ValueComponent: ValueComponent })

export const HatchifyExtraDisplay: React.FC<HatchifyExtraDisplayProps> = () => {
  return null
}

export type HatchifyAttributeDisplayProps = {
  attribute: string
  label?: string
} & ({ renderValue?: RenderValue } | { ValueComponent?: ValueComponent })

export const HatchifyAttributeDisplay: React.FC<
  HatchifyAttributeDisplayProps
> = () => {
  return null
}

export type HatchifyAttributeFieldProps = {
  attribute: string
  label?: string
} & ({ render?: FormFieldRender } | { FieldComponent?: FieldComponent })

export const HatchifyAttributeField: React.FC<
  HatchifyAttributeFieldProps
> = () => {
  return null
}
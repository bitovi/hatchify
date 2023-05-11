import type {
  FlatRecord,
  ValueComponent,
  CellValue,
  Attribute,
} from "../../presentation/interfaces"

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


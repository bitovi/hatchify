import type {
  ValueComponent,
  FlatRecord,
  Attribute,
  CellValue,
} from "../../presentation/interfaces"
// import type { Attribute } from "../../schemas/schemas"

export type Render = ({ record }: { record: FlatRecord }) => JSX.Element

export type HatchifyExtraDisplayProps = {
  label: string
  after?: string
} & ({ render: Render } | { ValueComponent: ValueComponent })

export const HatchifyExtraDisplay: React.FC<HatchifyExtraDisplayProps> = () => {
  return null
}

export type RenderValue = ({
  value,
  record,
  attributeSchema,
}: {
  value: CellValue
  record: FlatRecord
  attributeSchema?: Attribute
}) => JSX.Element

export type HatchifyAttributeDisplayProps = {
  attribute: string
  label?: string
} & ({ renderValue?: RenderValue } | { ValueComponent?: ValueComponent })

export const HatchifyAttributeDisplay: React.FC<
  HatchifyAttributeDisplayProps
> = () => {
  return null
}

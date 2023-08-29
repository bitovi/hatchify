import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number"
import type { FinalAttribute, PartialAttribute } from "../types"

export type PartialAttributeRecord = Record<
  string,
  PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
>
export interface PartialSchema<
  TAttributes extends PartialAttributeRecord = PartialAttributeRecord,
> {
  name: string
  id?: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: TAttributes
}

export interface FinalSchema {
  name: string
  id: FinalAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: {
    [attributeName: string]: FinalAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  }
}

export type PartialSchemaWithPrimaryAttribute = Omit<
  PartialSchema<PartialAttributeRecord>,
  "id"
> & {
  id: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
}

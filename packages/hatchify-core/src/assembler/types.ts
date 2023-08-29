import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number"
import type { FinalAttribute, PartialAttribute } from "../types"

export interface PartialSchema<
  TAttributes extends Record<
    string,
    PartialAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  > = any,
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

export type PartialSchemaWithPrimaryAttribute = Omit<PartialSchema, "id"> & {
  id: PartialAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
}

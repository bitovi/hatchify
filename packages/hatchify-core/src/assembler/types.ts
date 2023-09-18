import {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
} from "../dataTypes/boolean"
import type {
  FinalDatetimeORM,
  PartialDatetimeControlType,
  PartialDatetimeORM,
} from "../dataTypes/datetime"
import type {
  FinalEnumORM,
  PartialEnumControlType,
  PartialEnumORM,
} from "../dataTypes/enumerate/types"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
} from "../dataTypes/string"
import type {
  FinalTextORM,
  PartialTextControlType,
  PartialTextORM,
} from "../dataTypes/text/types"
import type {
  FinalRelationship,
  PartialRelationship,
} from "../relationships/types"
import type { FinalAttribute, PartialAttribute } from "../types"

export type PartialAttributeRecord = Record<
  string,
  | PartialAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | PartialAttribute<
      PartialStringORM,
      PartialStringControlType,
      string,
      FinalStringORM
    >
  | PartialAttribute<
      PartialDatetimeORM,
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | PartialAttribute<
      PartialEnumORM,
      PartialEnumControlType,
      string,
      FinalEnumORM
    >
  | PartialAttribute<
      PartialTextORM,
      PartialTextControlType,
      string,
      FinalTextORM
    >
  | PartialAttribute<
      PartialBooleanORM,
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
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
  relationships?: Record<string, PartialRelationship>
}

export type FinalAttributeRecord = Record<
  string,
  | FinalAttribute<
      PartialNumberORM,
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | FinalAttribute<
      PartialStringORM,
      PartialStringControlType,
      string,
      FinalStringORM
    >
  | FinalAttribute<
      PartialDatetimeORM,
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | FinalAttribute<PartialEnumORM, PartialEnumControlType, string, FinalEnumORM>
>

export interface FinalSchema {
  name: string
  id: FinalAttribute<
    PartialNumberORM,
    PartialNumberControlType,
    number,
    FinalNumberORM
  >
  attributes: FinalAttributeRecord
  relationships?: Record<string, FinalRelationship>
}

export interface SemiFinalSchema extends Omit<FinalSchema, "relationships"> {
  relationships?: Record<string, PartialRelationship | FinalRelationship>
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

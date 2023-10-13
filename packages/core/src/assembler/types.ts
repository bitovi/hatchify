import type {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
} from "../dataTypes/boolean"
import type {
  FinalDateonlyORM,
  PartialDateonlyControlType,
  PartialDateonlyORM,
} from "../dataTypes/dateonly"
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
import type { FinalUuidORM, PartialUuidORM } from "../dataTypes/uuid/types"
import type {
  FinalRelationship,
  PartialRelationship,
} from "../relationships/types"
import type { FinalAttribute, PartialAttribute } from "../types"

export type PartialAttributeRecord = Record<
  string,
  | PartialAttribute<
      PartialBooleanORM,
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | PartialAttribute<
      PartialDateonlyORM,
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
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
      PartialTextORM,
      PartialTextControlType,
      string,
      FinalTextORM
    >
  | PartialAttribute<
      PartialUuidORM,
      PartialStringControlType,
      string,
      FinalUuidORM
    >
>

export interface PartialSchema<
  TAttributes extends PartialAttributeRecord = PartialAttributeRecord,
> {
  name: string
  namespace?: string
  pluralName?: string
  displayAttribute?: string
  id?: PartialAttribute<
    PartialUuidORM,
    PartialStringControlType,
    string,
    FinalUuidORM
  >
  attributes: TAttributes
  relationships?: Record<string, PartialRelationship>
}

export type FinalAttributeRecord = Record<
  string,
  | FinalAttribute<
      PartialBooleanORM,
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | FinalAttribute<
      PartialDateonlyORM,
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
    >
  | FinalAttribute<
      PartialDatetimeORM,
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | FinalAttribute<PartialEnumORM, PartialEnumControlType, string, FinalEnumORM>
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
  | FinalAttribute<PartialTextORM, PartialTextControlType, string, FinalTextORM>
  | FinalAttribute<
      PartialUuidORM,
      PartialStringControlType,
      string,
      FinalUuidORM
    >
>

export interface FinalSchema {
  name: string
  namespace?: string
  pluralName?: string
  displayAttribute?: string
  id: FinalAttribute<
    PartialUuidORM,
    PartialStringControlType,
    string,
    FinalUuidORM
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
    PartialUuidORM,
    PartialStringControlType,
    string,
    FinalUuidORM
  >
}

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
      // @ts-expect-error
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | PartialAttribute<
      PartialDateonlyORM,
      // @ts-expect-error
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
    >
  | PartialAttribute<
      PartialDatetimeORM,
      // @ts-expect-error
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
      // @ts-expect-error
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | PartialAttribute<
      PartialStringORM,
      // @ts-expect-error
      PartialStringControlType,
      string,
      FinalStringORM
    >
  | PartialAttribute<
      PartialTextORM,
      // @ts-expect-error
      PartialTextControlType,
      string,
      FinalTextORM
    >
  | PartialAttribute<
      PartialUuidORM,
      // @ts-expect-error
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
  displayName?: string
  id?: PartialAttribute<
    PartialUuidORM,
    // @ts-expect-error
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
      // @ts-expect-error
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | FinalAttribute<
      PartialDateonlyORM,
      // @ts-expect-error
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
    >
  | FinalAttribute<
      PartialDatetimeORM,
      // @ts-expect-error
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | FinalAttribute<PartialEnumORM, PartialEnumControlType, string, FinalEnumORM>
  | FinalAttribute<
      PartialNumberORM,
      // @ts-expect-error
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | FinalAttribute<
      PartialStringORM,
      // @ts-expect-error
      PartialStringControlType,
      string,
      FinalStringORM
    >
  // @ts-expect-error
  | FinalAttribute<PartialTextORM, PartialTextControlType, string, FinalTextORM>
  | FinalAttribute<
      PartialUuidORM,
      // @ts-expect-error
      PartialStringControlType,
      string,
      FinalUuidORM
    >
>

export interface FinalSchema {
  name: string
  namespace?: string
  pluralName?: string
  displayName?: string
  id: FinalAttribute<
    PartialUuidORM,
    // @ts-expect-error
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
    // @ts-expect-error
    PartialStringControlType,
    string,
    FinalUuidORM
  >
}

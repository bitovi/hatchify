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
      // @ts-expect-error @todo HATCH-417
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | PartialAttribute<
      PartialDateonlyORM,
      // @ts-expect-error @todo HATCH-417
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
    >
  | PartialAttribute<
      PartialDatetimeORM,
      // @ts-expect-error @todo HATCH-417
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | PartialAttribute<
      PartialEnumORM,
      // @ts-expect-error @todo HATCH-417
      PartialEnumControlType,
      string,
      FinalEnumORM
    >
  | PartialAttribute<
      PartialNumberORM,
      // @ts-expect-error @todo HATCH-417
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | PartialAttribute<
      PartialStringORM,
      // @ts-expect-error @todo HATCH-417
      PartialStringControlType,
      string,
      FinalStringORM
    >
  | PartialAttribute<
      PartialTextORM,
      // @ts-expect-error @todo HATCH-417
      PartialTextControlType,
      string,
      FinalTextORM
    >
  | PartialAttribute<
      PartialUuidORM,
      // @ts-expect-error @todo HATCH-417
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
  ui?: {
    displayAttribute?: string
  }
  id?: PartialAttribute<
    PartialUuidORM,
    // @ts-expect-error @todo HATCH-417
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
      // @ts-expect-error @todo HATCH-417
      PartialBooleanControlType,
      boolean,
      FinalBooleanORM
    >
  | FinalAttribute<
      PartialDateonlyORM,
      // @ts-expect-error @todo HATCH-417
      PartialDateonlyControlType,
      string,
      FinalDateonlyORM
    >
  | FinalAttribute<
      PartialDatetimeORM,
      // @ts-expect-error @todo HATCH-417
      PartialDatetimeControlType,
      Date,
      FinalDatetimeORM
    >
  | FinalAttribute<
      PartialEnumORM,
      // @ts-expect-error @todo HATCH-417
      PartialEnumControlType,
      string,
      FinalEnumORM
    >
  | FinalAttribute<
      PartialNumberORM,
      // @ts-expect-error @todo HATCH-417
      PartialNumberControlType,
      number,
      FinalNumberORM
    >
  | FinalAttribute<
      PartialStringORM,
      // @ts-expect-error @todo HATCH-417
      PartialStringControlType,
      string,
      FinalStringORM
    >
  | FinalAttribute<
      PartialTextORM,
      // @ts-expect-error @todo HATCH-417
      PartialTextControlType,
      string,
      FinalTextORM
    >
  | FinalAttribute<
      PartialUuidORM,
      // @ts-expect-error @todo HATCH-417
      PartialStringControlType,
      string,
      FinalUuidORM
    >
>

export interface FinalSchema {
  name: string
  namespace?: string
  pluralName?: string
  ui: {
    displayAttribute?: string
  }
  id: FinalAttribute<
    PartialUuidORM,
    // @ts-expect-error @todo HATCH-417
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
    // @ts-expect-error @todo HATCH-417
    PartialStringControlType,
    string,
    FinalUuidORM
  >
}

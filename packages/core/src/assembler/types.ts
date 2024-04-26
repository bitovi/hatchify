import type {
  FinalBooleanORM,
  PartialBooleanControlType,
  PartialBooleanORM,
} from "../dataTypes/boolean/index.js"
import type {
  FinalDateonlyORM,
  PartialDateonlyControlType,
  PartialDateonlyORM,
} from "../dataTypes/dateonly/index.js"
import type {
  FinalDatetimeORM,
  PartialDatetimeControlType,
  PartialDatetimeORM,
} from "../dataTypes/datetime/index.js"
import type {
  FinalEnumORM,
  PartialEnumControlType,
  PartialEnumORM,
} from "../dataTypes/enumerate/types.js"
import type {
  FinalNumberORM,
  PartialNumberControlType,
  PartialNumberORM,
} from "../dataTypes/number/index.js"
import type {
  FinalStringORM,
  PartialStringControlType,
  PartialStringORM,
} from "../dataTypes/string/index.js"
import type {
  FinalTextORM,
  PartialTextControlType,
  PartialTextORM,
} from "../dataTypes/text/types.js"
import type { FinalUuidORM, PartialUuidORM } from "../dataTypes/uuid/types.js"
import type {
  FinalRelationship,
  PartialRelationship,
} from "../relationships/types.js"
import type { FinalAttribute, PartialAttribute } from "../types/index.js"

export type PartialAttributeOptions =
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

export type PartialAttributeRecord = Record<string, PartialAttributeOptions>

export interface PartialSchema<
  TAttributes extends PartialAttributeRecord = PartialAttributeRecord,
> {
  name: string
  namespace?: string
  pluralName?: string
  tableName?: string
  ui?: {
    displayAttribute?: string
  }
  id?: PartialAttributeOptions
  attributes: TAttributes
  relationships?: Record<string, PartialRelationship>
  readOnly?: boolean
}

export type FinalAttributeOptions =
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

export type FinalAttributeRecord = Record<string, FinalAttributeOptions>

export interface FinalSchema {
  name: string
  namespace?: string
  pluralName?: string
  tableName?: string
  ui: {
    displayAttribute?: string
  }
  id: FinalAttributeOptions
  attributes: FinalAttributeRecord
  relationships?: Record<string, FinalRelationship>
  readOnly: boolean
}

export interface SemiFinalSchema extends Omit<FinalSchema, "relationships"> {
  relationships?: Record<string, PartialRelationship | FinalRelationship>
}

export type PartialSchemaWithPrimaryAttribute = Omit<
  PartialSchema<PartialAttributeRecord>,
  "id"
> & {
  id: PartialAttributeOptions
}

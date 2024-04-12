export type ValueInRequest =
  | boolean
  | number
  | string
  | Date
  | object
  | null
  | undefined

export type UserValue = ValueInRequest

export type SerializedValue = number | string | object | null

export enum ControlTypes {
  Boolean = "Boolean",
  Number = "Number",
  String = "String",
  Date = "Date",
  Dateonly = "Dateonly",
  enum = "enum",
}

export * from "../assembler/types.js"
export * from "../relationships/types.js"

export class HatchifyCoerceError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export class HatchifyInvalidSchemaError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export interface PartialDataTypeProps<
  PrimitiveType,
  TRequired extends boolean,
> {
  hidden?: boolean
  primary?: boolean
  required?: TRequired // @todo HATCH-417
  default?: PrimitiveType | (() => PrimitiveType) | null
  unique?: boolean
  displayName?: string
  ui?: {
    enableCaseSensitiveContains?: boolean
  }
}

export interface PartialControlType<PrimitiveType, TRequired extends boolean> {
  type: keyof typeof ControlTypes
  allowNullInfer: TRequired extends true ? false : true // @todo HATCH-417
  allowNull?: boolean
  hidden?: boolean
  primary?: boolean
  default?: PrimitiveType | (() => PrimitiveType) | null
  displayName?: string | null
}

export interface PartialSequelizeDataType<ArgsType, PrimitiveType> {
  type: string
  typeArgs: ArgsType
  allowNull?: boolean
  primaryKey?: boolean
  defaultValue?: PrimitiveType | (() => PrimitiveType) | null
  unique?: boolean
}

export interface PartialAttribute<
  PartialORMTypeTemplate,
  PartialControlTypeTemplate,
  PrimitiveType,
  FinalORMTypeTemplate,
> {
  name: string
  orm: PartialORMTypeTemplate
  control: PartialControlTypeTemplate
  finalize: () => FinalAttribute<
    PartialORMTypeTemplate,
    Omit<PartialControlTypeTemplate, "allowNullInfer">,
    PrimitiveType,
    FinalORMTypeTemplate
  >
}

export interface FinalAttribute<
  PartialORMTypeTemplate,
  PartialControlTypeTemplate,
  PrimitiveType,
  FinalORMTypeTemplate,
> extends Omit<
    PartialAttribute<
      PartialORMTypeTemplate,
      PartialControlTypeTemplate,
      PrimitiveType,
      FinalORMTypeTemplate
    >,
    "orm" | "finalize"
  > {
  orm: FinalORMTypeTemplate
  control: Required<PartialControlTypeTemplate>
  // todo: client-side optional until types catch up
  setClientPropertyValue?: (userValue: UserValue) => PrimitiveType | null
  serializeClientPropertyValue?: (
    value: PrimitiveType | null,
  ) => SerializedValue
  setClientQueryFilterValue?: (queryValue: UserValue) => PrimitiveType | null
  serializeClientQueryFilterValue?: (
    value: PrimitiveType | null,
  ) => SerializedValue
  setClientPropertyValueFromResponse?: (
    jsonValue: ValueInRequest,
  ) => PrimitiveType | null
  setORMPropertyValue: (jsonValue: ValueInRequest) => PrimitiveType | null
  setORMQueryFilterValue: (queryValue: string) => PrimitiveType | null
  serializeORMPropertyValue: (
    ormValue: PrimitiveType | null,
  ) => PrimitiveType | null
}

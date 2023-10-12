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

export * from "../assembler/types"
export * from "../relationships/types"

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
  primary?: boolean
  required?: TRequired // @todo arthur - this is required to map to allowNullInfer
  default?: PrimitiveType | (() => PrimitiveType) | null
}

export type PartialControlType<PrimitiveType, TRequired extends boolean> = {
  type: "Boolean" | "Number" | "String" | "Datetime" | "Dateonly"
  allowNullInfer: TRequired extends true ? false : true // @todo arthur
  allowNull?: boolean
  primary?: boolean
  default?: PrimitiveType | (() => PrimitiveType) | null
}

export interface PartialSequelizeDataType<ArgsType, PrimitiveType> {
  type: string
  typeArgs: ArgsType
  allowNull?: boolean
  primaryKey?: boolean
  defaultValue?: PrimitiveType | (() => PrimitiveType) | null
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

export type UserValue = number | string | Date | object | null | undefined

export type ValueInRequest = number | string | Date | object | null | undefined

export * from "../assembler/types"

export class HatchifyCoerceError extends Error {
  constructor(message: string) {
    super(message)
  }
}

export interface PartialDataTypeProps {
  primary?: boolean
  required?: boolean
}

export type PartialControlType = {
  type: "Boolean" | "Number" | "String" | "Datetime"
  allowNull?: boolean
  primary?: boolean
}

export interface PartialSequelizeDataType<PrimitiveType> {
  type: string
  typeArgs: PrimitiveType
  allowNull?: boolean
  primaryKey?: boolean
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
    PartialControlTypeTemplate,
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
  ) => PrimitiveType | null
  setClientQueryFilterValue?: (queryValue: UserValue) => PrimitiveType | null
  serializeClientQueryFilterValue?: (value: PrimitiveType | null) => string
  setClientPropertyValueFromResponse?: (
    jsonValue: ValueInRequest,
  ) => PrimitiveType | null
  setORMPropertyValue: (jsonValue: ValueInRequest) => PrimitiveType | null
  setORMQueryFilterValue: (queryValue: string) => PrimitiveType | null
  serializeORMPropertyValue: (
    ormValue: PrimitiveType | null,
  ) => PrimitiveType | null
}

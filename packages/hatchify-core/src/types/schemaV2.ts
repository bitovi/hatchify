export type ValueInRequest = number | string | object | null | undefined

export interface PartialDataTypeProps {
  primary?: boolean
  required?: boolean
}

export interface PartialControlType {
  type: "Boolean" | "Number" | "String"
  allowNull?: boolean
  primary?: boolean
}

export interface PartialSequelizeDataType<PrimitiveType> {
  type: string
  typeArgs: PrimitiveType
  allowNull?: boolean
  autoIncrement?: boolean
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
  setORMPropertyValue: (jsonValue: ValueInRequest) => PrimitiveType | null
  setORMQueryFilterValue: (queryValue: string) => PrimitiveType | null
  serializeORMPropertyValue: (
    ormValue: PrimitiveType | null,
  ) => PrimitiveType | null
}

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

export interface PartialSequelizeDataType<T> {
  type: string
  typeArgs: T
  allowNull?: boolean
  autoIncrement?: boolean
  primaryKey?: boolean
}

export interface PartialAttribute<PO, PC, T, FO> {
  name: string
  orm: PO
  control: PC
  finalize: () => FinalAttribute<PO, PC, T, FO>
}

export interface FinalAttribute<PO, PC, T, FO>
  extends Omit<PartialAttribute<PO, PC, T, FO>, "orm" | "finalize"> {
  orm: FO
  control: Required<PC>
  setORMPropertyValue: (jsonValue: ValueInRequest) => T | null
  setORMQueryFilterValue: (queryValue: string) => T | null
  serializeORMPropertyValue: (ormValue: T | null) => T | null
}

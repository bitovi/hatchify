export interface HatchifyDataTypeProps {
  primary?: boolean
  required?: boolean
}

export interface HatchifyDataTypeControl {
  allowNull?: boolean
  primary?: boolean
}

export interface HatchifyNumberProps extends HatchifyDataTypeProps {
  autoIncrement?: boolean
  min?: number
  max?: number
  step?: number
}

export interface HatchifyNumberControl extends HatchifyDataTypeControl {
  autoIncrement: boolean
  min: number
  max: number
  step: number
}

export type HatchifyIntegerProps = Omit<HatchifyNumberProps, "step">

export interface PartialSchemaV2 extends Omit<SchemaV2, "id"> {
  id?: PartialAttribute<number>
}

export interface SchemaV2 {
  name: string
  id: PartialAttribute<number>
  attributes: {
    [attributeName: string]: PartialAttribute<number>
  }
}

export interface SequelizeDataType {
  type: string
  typeArgs: Array<number | string>
  allowNull?: boolean
  autoIncrement?: boolean
  primaryKey?: boolean
  validate?: {
    min?: number
    max?: number
  }
}

export interface ControlType {
  type: string
  allowNull?: boolean
  min?: number
  max?: number
  primary?: boolean
  step?: number
}

export interface PartialAttribute<T> {
  name: string
  orm: { sequelize: SequelizeDataType }
  control: ControlType
  setORMPropertyValue: (jsonValue: T | null) => T | null
  setORMQueryFilterValue: (queryValue: string) => T | null
  serializeORMPropertyValue: (ormValue: T | null) => T | null
}

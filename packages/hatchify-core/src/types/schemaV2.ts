import type { HatchifyBaseDataType } from "../dataTypes"

export interface SchemaV2 {
  name: string
  id: HatchifyBaseDataType
  attributes: {
    [attributeName: string]: HatchifyBaseDataType
  }
}

export interface PreparedDataType<T> {
  name: string
  orm: {
    sequelize: {
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
  }
  controlType: {
    type: string
    allowNull?: boolean
    min?: number
    max?: number
    primary?: boolean
    step?: number
  }
  setORMPropertyValue: (jsonValue: T | null) => T | null
  setORMQueryFilterValue: (queryValue: string) => T | null
  serializeORMPropertyValue: (ormValue: T | null) => T | null
}

import type { PartialSchema } from "@hatchifyjs/core"

export type Include<TPartialSchema extends PartialSchema> =
  | Array<keyof TPartialSchema["relationships"]>
  // todo HATCH-452
  | string[]

// @todo HATCH-417
// key should be typed by schemaName or namespace_schemaName
// string should then be typed by attributes or relationships of that schema
export type Fields = { [key: string]: string[] }

export type Selector<TPartialSchema extends PartialSchema> = {
  include?: Include<TPartialSchema>
  fields?: Fields
}

export type FilterArray = Array<{
  field: string
  operator: string
  value: string | string[] | number | number[] | boolean | boolean[]
}>

export type FilterTypes =
  | "$eq"
  | "$ne"
  | "$gt"
  | "$gte"
  | "$lt"
  | "$lte"
  | "$in"
  | "$nin"
  | "$like"
  | "$ilike"
  | "empty"
  | "nempty"

export type FiltersObject = {
  [field: string]: {
    [filter in FilterTypes]?:
      | string
      | string[]
      | number
      | number[]
      | boolean
      | boolean[]
  }
}

export type Filters = FilterArray | FiltersObject | string | undefined

export interface PaginationObject {
  number: number
  size: number
}

export type QueryList<TPartialSchema extends PartialSchema> =
  Selector<TPartialSchema> & {
    page?: PaginationObject
    sort?: string[] | string
    filter?: Filters
  }

export type QueryOne<TPartialSchema extends PartialSchema> =
  Selector<TPartialSchema> & { id: string }

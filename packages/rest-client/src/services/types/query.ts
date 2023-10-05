export type Include = string[] // todo: typed to schema relationships

export type Fields = { [key: string]: string[] } // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

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

export type QueryList = Selector & {
  page?: PaginationObject
  sort?: string[] | string
  filter?: Filters
}

export type QueryOne = Selector & { id: string }

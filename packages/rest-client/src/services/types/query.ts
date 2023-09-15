export type Include = string[] // todo: typed to schema relationships

export type Fields = { [key: string]: string[] } // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

export type FilterArray = Array<{
  field: string
  operator: string
  value: string | string[] | number | number[] | boolean | boolean[]
}>

export type FilterObject = {
  [key: string]: string | string[] | number | number[] | boolean | boolean[]
}

export type Filters = FilterArray | FilterObject | string | undefined // why do we want undefined as a possible option? should we remove it?

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

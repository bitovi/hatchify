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

export type Filters = FilterArray | FilterObject | string | undefined

export type QueryList = Selector & {
  page?: unknown
  sort?: string[] | string
  filter?: Filters
}

export type QueryOne = Selector & { id: string }

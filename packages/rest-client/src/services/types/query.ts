export type Include = string[] // todo: typed to schema relationships

export type Fields = { [key: string]: string[] } // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

export type FilterArray = Array<{
  field: string
  operator: string
  value: string
}>

export type Filters = FilterArray | string | undefined

export type QueryList = Selector & {
  page?: unknown
  sort?: string[] | string
  filter?: Filters
}

export type QueryOne = Selector & { id: string }

export type Include = string[] // todo: typed to schema relationships

export type Fields = { [key: string]: string[] } // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

export type FilterRecord = Record<string, any>

export type FilterObj = {
  operator: string
} & FilterRecord

export type Filter = FilterObj[] | string | undefined

export type QueryList = Selector & {
  page?: unknown
  sort?: string[] | string
  filter?: Filter
}

export type QueryOne = Selector & { id: string }

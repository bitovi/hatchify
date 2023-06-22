export type Include = string[] // todo: typed to schema relationships

export type Fields = string[] // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

export type Filter = string | Record<string, any>

export type QueryList = Selector & {
  page?: { size: number; number: number }
  sort?: string[] | string
  filter?: Filter
}

export type QueryOne = Selector & { id: string }

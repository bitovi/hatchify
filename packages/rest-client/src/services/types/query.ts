export type Include = string[] // todo: typed to schema relationships

export type Fields = { [key: string]: string[] } // todo: typed to schema attributes & relationships.attributes

export type Selector = { include?: Include; fields?: Fields }

export type QueryList = Selector & {
  page?: { size: number; number: number }
  sort?: string[] | string
  filter?: { [key: string]: { [filter: string]: string } }
}

export type QueryOne = Selector & { id: string }

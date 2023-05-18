// @todo Selector (Include/Fields)

export interface QueryList {
  fields?: string[]
  page?: { size: number; number: number }
  sort?: { [key: string]: "asc" | "desc" }
  filter?: { [key: string]: { [filter: string]: string } }
}

export type QueryOne = { id: string; fields?: string[] }

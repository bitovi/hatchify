export interface Schema {
  name: string // "Article"
  resource: string // "articles"
  displayAttribute: string
  attributes: {
    [field: string]: string | { type: string }
  }
  relationships?: {
    [field: string]: {
      type: "many" | "one"
      schema: string
    }
  }
}

export interface QueryList {
  fields?: string[]
  page?: { size: number; number: number }
  sort?: { [key: string]: "asc" | "desc" }
  filter?: { [key: string]: { [filter: string]: string } }
}

export interface Record {
  id: string
  [key: string]: any // @todo strict typing
}

export interface SourceConfig {
  baseUrl: string
  resource: string
}

export interface Source {
  getList: (resource: string, query: QueryList) => Promise<{ data: Record[] }>
}

export interface Record {
  id: string
  [key: string]: any // @todo strict typing
}

export interface Resource {
  id: string
  __schema: string
  attributes?: {
    [key: string]: any // @todo
  }
  relationships?: {
    [key: string]: any // @todo
  }
}

export type CreateData = Omit<Record, "id" | "__schema">
